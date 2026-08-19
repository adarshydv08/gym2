package com.gymmanagement.service;

import com.gymmanagement.dto.AuthRequest;
import com.gymmanagement.dto.AuthResponse;
import com.gymmanagement.dto.RegisterRequest;
import com.gymmanagement.entity.*;
import com.gymmanagement.repository.*;
import com.gymmanagement.security.JwtTokenProvider;
import com.gymmanagement.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final ManagerRepository managerRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == com.gymmanagement.entity.UserStatus.PENDING) {
            throw new RuntimeException("Your account is pending approval from the owner.");
        }

        if (user.getStatus() == com.gymmanagement.entity.UserStatus.REJECTED) {
            throw new RuntimeException("Your account was rejected. Please contact the gym owner for assistance.");
        }

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        // Validate requested role if provided
        String activeRole = request.getSelectedRole();
        if (activeRole != null && !activeRole.isEmpty()) {
            if (!roles.contains(activeRole)) {
                throw new RuntimeException("Access denied: You do not have the '" + activeRole + "' role assigned to your account.");
            }
        } else {
            activeRole = roles.contains("ROLE_OWNER") ? "ROLE_OWNER" :
                         roles.contains("ROLE_MANAGER") ? "ROLE_MANAGER" :
                         roles.contains("ROLE_TRAINER") ? "ROLE_TRAINER" :
                         "ROLE_MEMBER";
        }

        Long memberId = memberRepository.findByUserId(user.getId()).map(Member::getId).orElse(null);
        Long managerId = managerRepository.findByUserId(user.getId()).map(Manager::getId).orElse(null);
        Long trainerId = trainerRepository.findByUserId(user.getId()).map(Trainer::getId).orElse(null);

        return AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roles(roles)
                .activeRole(activeRole)
                .memberId(memberId)
                .managerId(managerId)
                .trainerId(trainerId)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse buildAuthResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String activeRole = roles.contains("ROLE_OWNER") ? "ROLE_OWNER" :
                roles.contains("ROLE_MANAGER") ? "ROLE_MANAGER" :
                roles.contains("ROLE_TRAINER") ? "ROLE_TRAINER" :
                "ROLE_MEMBER";

        Long memberId = memberRepository.findByUserId(user.getId()).map(com.gymmanagement.entity.Member::getId).orElse(null);
        Long managerId = managerRepository.findByUserId(user.getId()).map(com.gymmanagement.entity.Manager::getId).orElse(null);
        Long trainerId = trainerRepository.findByUserId(user.getId()).map(com.gymmanagement.entity.Trainer::getId).orElse(null);

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .roles(roles)
                .activeRole(activeRole)
                .memberId(memberId)
                .managerId(managerId)
                .trainerId(trainerId)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address is already in use.");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number is already in use.");
        }

        String roleName = (request.getRole() != null && !request.getRole().isEmpty()) ? request.getRole() : "ROLE_MEMBER";
        if ("ROLE_OWNER".equals(roleName)) {
            throw new RuntimeException("Owner registration is not available from this portal.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found"));

        com.gymmanagement.entity.UserStatus status = com.gymmanagement.entity.UserStatus.PENDING;
        if ("ROLE_OWNER".equals(roleName)) {
            status = com.gymmanagement.entity.UserStatus.ACTIVE;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(role))
                .status(status)
                .build();

        User savedUser = userRepository.save(user);

        Long memberId = null;
        Long trainerId = null;
        if ("ROLE_MEMBER".equals(roleName)) {
            Member member = Member.builder()
                    .user(savedUser)
                    .membershipNumber("IF-2026-" + String.format("%03d", savedUser.getId()))
                    .emergencyContact(request.getEmergencyContact())
                    .gender(request.getGender())
                    .fitnessGoal(request.getFitnessGoal())
                    .address(request.getAddress())
                    .weightKg(request.getWeightKg())
                    .heightCm(request.getHeightCm())
                    .bloodGroup(request.getBloodGroup())
                    .build();
            Member savedMember = memberRepository.save(member);
            memberId = savedMember.getId();
        }

        if ("ROLE_MANAGER".equals(roleName)) {
            Manager manager = Manager.builder()
                    .user(savedUser)
                    .department("Operations & Member Services")
                    .build();
            managerRepository.save(manager);
        }

        if ("ROLE_TRAINER".equals(roleName)) {
            Trainer trainer = Trainer.builder()
                    .user(savedUser)
                    .specialization("General Fitness")
                    .experienceYears(3)
                    .certifications("Certified Trainer")
                    .bio("New trainer profile awaiting approval")
                    .build();
            Trainer savedTrainer = trainerRepository.save(trainer);
            trainerId = savedTrainer.getId();
        }

        // Create a pending notification for owners/managers
        try {
            var owners = userRepository.findByRoles_Name("ROLE_OWNER");
            var managers = userRepository.findByRoles_Name("ROLE_MANAGER");
            var recipients = new java.util.ArrayList<Long>();
            owners.forEach(o -> recipients.add(o.getId()));
            managers.forEach(m -> recipients.add(m.getId()));
            for (Long rid : recipients) {
                var recipientUser = userRepository.findById(rid).orElse(null);
                if (recipientUser == null) continue;
                Notification n = Notification.builder()
                        .user(recipientUser)
                        .title("New Registration Request")
                        .message(savedUser.getName() + " registered as " + roleName + " and requires approval.")
                        .type("REGISTRATION")
                        .isRead(false)
                        .build();
                notificationRepository.save(n);
            }
        } catch (Exception ignore) {}

        if (status == com.gymmanagement.entity.UserStatus.PENDING) {
            return AuthResponse.builder()
                    .userId(savedUser.getId())
                    .name(savedUser.getName())
                    .email(savedUser.getEmail())
                    .phone(savedUser.getPhone())
                    .roles(Set.of(roleName))
                    .activeRole(roleName)
                    .memberId(memberId)
                    .trainerId(trainerId)
                    .build();
        }

        // Generate token immediately
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .roles(Set.of(roleName))
                .activeRole(roleName)
                .memberId(memberId)
                .build();
    }
}
