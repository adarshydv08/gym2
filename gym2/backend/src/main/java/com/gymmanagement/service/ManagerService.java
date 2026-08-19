package com.gymmanagement.service;

import com.gymmanagement.dto.PendingApprovalResponse;
import com.gymmanagement.entity.Manager;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.Trainer;
import com.gymmanagement.entity.User;
import com.gymmanagement.entity.Notification;
import com.gymmanagement.repository.ManagerRepository;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.TrainerRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public List<Manager> getAllManagers() {
        List<User> managerUsers = userRepository.findByRoles_Name("ROLE_MANAGER");
        for (User u : managerUsers) {
            if (!managerRepository.existsByUserId(u.getId())) {
                Manager m = Manager.builder()
                        .user(u)
                        .department("Operations & Member Services")
                        .build();
                managerRepository.save(m);
            }
        }
        return managerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<PendingApprovalResponse> getPendingApprovals() {
        boolean isManager = currentUserHasRole("ROLE_MANAGER");
        return userRepository.findByStatus(com.gymmanagement.entity.UserStatus.PENDING).stream()
                .filter(user -> user.getRoles().stream().anyMatch(role -> Set.of("ROLE_MANAGER", "ROLE_TRAINER", "ROLE_MEMBER").contains(role.getName())))
                .filter(user -> {
                    if (isManager) {
                        return user.getRoles().stream().noneMatch(role -> "ROLE_MANAGER".equals(role.getName()));
                    }
                    return true;
                })
                .map(this::toPendingApprovalResponse)
                .sorted(Comparator.comparing(PendingApprovalResponse::getRegistrationDate).reversed())
                .toList();
    }

    @Transactional
    public PendingApprovalResponse approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        if (currentUserHasRole("ROLE_MANAGER") && user.getRoles().stream().anyMatch(role -> "ROLE_MANAGER".equals(role.getName()))) {
            throw new RuntimeException("Manager users must be approved by the owner.");
        }
        user.setStatus(com.gymmanagement.entity.UserStatus.ACTIVE);
        userRepository.save(user);
        // create notification for the user
        try {
            Notification n = Notification.builder()
                    .user(user)
                    .title("Account Approved")
                    .message("Your account has been approved. You can now log in.")
                    .type("APPROVAL")
                    .isRead(false)
                    .build();
            notificationRepository.save(n);
        } catch (Exception ignore) {}
        return toPendingApprovalResponse(user);
    }

    @Transactional
    public PendingApprovalResponse rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        if (currentUserHasRole("ROLE_MANAGER") && user.getRoles().stream().anyMatch(role -> "ROLE_MANAGER".equals(role.getName()))) {
            throw new RuntimeException("Manager users must be rejected by the owner.");
        }
        user.setStatus(com.gymmanagement.entity.UserStatus.REJECTED);
        userRepository.save(user);
        try {
            Notification n = Notification.builder()
                    .user(user)
                    .title("Account Rejected")
                    .message("Your account registration was rejected. Please contact the gym owner for details.")
                    .type("REJECTION")
                    .isRead(false)
                    .build();
            notificationRepository.save(n);
        } catch (Exception ignore) {}
        return toPendingApprovalResponse(user);
    }

    private boolean currentUserHasRole(String roleName) {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(roleName));
    }

    @Transactional
    public Manager approveManager(Long managerId) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + managerId));

        User user = manager.getUser();
        if (user.getStatus() == com.gymmanagement.entity.UserStatus.PENDING || user.getStatus() == com.gymmanagement.entity.UserStatus.REJECTED) {
            user.setStatus(com.gymmanagement.entity.UserStatus.ACTIVE);
            userRepository.save(user);
        }
        return manager;
    }

    private PendingApprovalResponse toPendingApprovalResponse(User user) {
        String requestedRole = user.getRoles().stream()
                .map(role -> role.getName())
                .filter(role -> Set.of("ROLE_MANAGER", "ROLE_TRAINER", "ROLE_MEMBER").contains(role))
                .findFirst()
                .orElse("ROLE_MEMBER");

        Long profileId = null;
        if ("ROLE_MEMBER".equals(requestedRole)) {
            profileId = memberRepository.findByUserId(user.getId()).map(Member::getId).orElse(null);
        } else if ("ROLE_TRAINER".equals(requestedRole)) {
            profileId = trainerRepository.findByUserId(user.getId()).map(Trainer::getId).orElse(null);
        } else if ("ROLE_MANAGER".equals(requestedRole)) {
            profileId = managerRepository.findByUserId(user.getId()).map(Manager::getId).orElse(null);
        }

        return PendingApprovalResponse.builder()
                .userId(user.getId())
                .profileId(profileId)
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .requestedRole(requestedRole)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .registrationDate(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate().toString() : null)
                .build();
    }
}
