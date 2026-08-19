package com.gymmanagement.service;

import com.gymmanagement.dto.CreateAppointmentRequest;
import com.gymmanagement.entity.AppointmentRequest;
import com.gymmanagement.entity.Notification;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.AppointmentRequestRepository;
import com.gymmanagement.repository.NotificationRepository;
import com.gymmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AppointmentRequestService {

    private final AppointmentRequestRepository appointmentRequestRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentRequest createRequest(CreateAppointmentRequest request) {
        AppointmentRequest appointmentRequest = AppointmentRequest.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .preferredService(request.getPreferredService())
                .preferredDate(request.getPreferredDate())
                .preferredTime(request.getPreferredTime())
                .message(request.getMessage())
                .status("NEW")
                .contacted(false)
                .build();

        AppointmentRequest saved = appointmentRequestRepository.save(appointmentRequest);
        notifyOwnersAndManagers(saved);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<AppointmentRequest> getAllRequests() {
        return appointmentRequestRepository.findAll();
    }

    @Transactional
    public AppointmentRequest markContacted(Long id) {
        AppointmentRequest request = appointmentRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment request not found with id: " + id));
        request.setContacted(true);
        request.setStatus("CONTACTED");
        appointmentRequestRepository.save(request);
        // notify owners/managers that this request was handled
        String msg = String.format("Appointment request from %s has been marked contacted.", request.getName());
        notifyOwnersAndManagersOnReply(msg);
        return request;
    }

    @Transactional
    public AppointmentRequest replyToRequester(Long id, String replyMessage, String contactedBy) {
        AppointmentRequest request = appointmentRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment request not found with id: " + id));
        request.setContacted(true);
        request.setStatus("CONTACTED");
        request.setReplyMessage(replyMessage);
        request.setContactedBy(contactedBy);
        request.setContactedAt(java.time.LocalDateTime.now());
        AppointmentRequest saved = appointmentRequestRepository.save(request);
        // notify owners/managers about the reply
        String msg = String.format("Replied to appointment request from %s: %s", request.getName(), replyMessage == null ? "(no message)" : replyMessage);
        notifyOwnersAndManagersOnReply(msg);
        return saved;
    }

    @Transactional
    public void deleteRequest(Long id) {
        if (!appointmentRequestRepository.existsById(id)) {
            throw new RuntimeException("Appointment request not found with id: " + id);
        }
        appointmentRequestRepository.deleteById(id);
    }

    private void notifyOwnersAndManagers(AppointmentRequest request) {
        List<User> owners = userRepository.findByRoles_Name("ROLE_OWNER");
        List<User> managers = userRepository.findByRoles_Name("ROLE_MANAGER");
        Set<Long> seenUserIds = new HashSet<>();
        List<User> recipients = new ArrayList<>();
        for (User user : owners) {
            if (seenUserIds.add(user.getId())) {
                recipients.add(user);
            }
        }
        for (User user : managers) {
            if (seenUserIds.add(user.getId())) {
                recipients.add(user);
            }
        }

        String message = String.format("Appointment request from %s for %s on %s %s.",
                request.getName(), request.getPreferredService(), request.getPreferredDate() == null ? "" : request.getPreferredDate(),
                request.getPreferredTime() == null ? "" : request.getPreferredTime()).trim();

        recipients.forEach(user -> {
            Notification notification = Notification.builder()
                    .user(user)
                    .title("New Appointment Request")
                    .message(message)
                    .type("APPOINTMENT")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        });
    }

    private void notifyOwnersAndManagersOnReply(String message) {
        List<User> owners = userRepository.findByRoles_Name("ROLE_OWNER");
        List<User> managers = userRepository.findByRoles_Name("ROLE_MANAGER");
        Set<Long> seenUserIds = new HashSet<>();
        List<User> recipients = new ArrayList<>();
        for (User user : owners) {
            if (seenUserIds.add(user.getId())) recipients.add(user);
        }
        for (User user : managers) {
            if (seenUserIds.add(user.getId())) recipients.add(user);
        }
        recipients.forEach(user -> {
            Notification notification = Notification.builder()
                    .user(user)
                    .title("Appointment Request Updated")
                    .message(message)
                    .type("APPOINTMENT")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        });
    }
}
