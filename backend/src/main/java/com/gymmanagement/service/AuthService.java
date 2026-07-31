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

        if ("PENDING".equals(user.getStatus())) {
            throw new RuntimeException("Your account is pending approval from the owner.");
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
                         roles.contains("ROLE_MANAGER") ? "ROLE_MANAGER" : "ROLE_MEMBER";
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

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address is already in use.");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number is already in use.");
        }

        String roleName = (request.getRole() != null && !request.getRole().isEmpty()) ? request.getRole() : "ROLE_MEMBER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found"));

        String status = "ACTIVE";
        if ("ROLE_MANAGER".equals(roleName)) {
            status = "PENDING";
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

        // If registering as member, create Member profile
        Long memberId = null;
        if ("ROLE_MEMBER".equals(roleName)) {
            Member member = Member.builder()
                    .user(savedUser)
                    .membershipNumber("IF-2026-" + String.format("%03d", savedUser.getId()))
                    .emergencyContact(request.getEmergencyContact())
                    .gender(request.getGender())
                    .address(request.getAddress())
                    .build();
            Member savedMember = memberRepository.save(member);
            memberId = savedMember.getId();
        }

        if ("PENDING".equals(status)) {
            return AuthResponse.builder()
                    .userId(savedUser.getId())
                    .name(savedUser.getName())
                    .email(savedUser.getEmail())
                    .phone(savedUser.getPhone())
                    .roles(Set.of(roleName))
                    .activeRole(roleName)
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
