package com.gymmanagement.config;

import com.gymmanagement.entity.*;
import com.gymmanagement.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ManagerRepository managerRepository;
    private final TrainerRepository trainerRepository;
    private final MemberRepository memberRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final GymSettingRepository gymSettingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Checking database initialization...");
        initRoles();
        initUsersAndProfiles();
        initMembershipPlans();
        initGymSettings();
        log.info("Database initialization completed successfully.");
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            log.info("Seeding default roles...");
            roleRepository.save(Role.builder().name("ROLE_OWNER").build());
            roleRepository.save(Role.builder().name("ROLE_MANAGER").build());
            roleRepository.save(Role.builder().name("ROLE_TRAINER").build());
            roleRepository.save(Role.builder().name("ROLE_MEMBER").build());
        }
    }

    private void initUsersAndProfiles() {
        if (userRepository.count() == 0) {
            log.info("Seeding default users and profiles...");

            Role ownerRole = roleRepository.findByName("ROLE_OWNER").orElse(null);
            Role managerRole = roleRepository.findByName("ROLE_MANAGER").orElse(null);
            Role trainerRole = roleRepository.findByName("ROLE_TRAINER").orElse(null);
            Role memberRole = roleRepository.findByName("ROLE_MEMBER").orElse(null);

            String defaultPassword = passwordEncoder.encode("Password@123");

            // 1. Owner
            User owner = User.builder()
                    .name("Aditya Sharma")
                    .email("owner@ironfit.in")
                    .phone("+91 98765 43210")
                    .password(defaultPassword)
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(ownerRole))
                    .build();
            userRepository.save(owner);

            // 2. Manager
            User managerUser = User.builder()
                    .name("Sonal Mehta")
                    .email("manager1@ironfit.in")
                    .phone("+91 98765 43211")
                    .password(defaultPassword)
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(managerRole))
                    .build();
            userRepository.save(managerUser);

            Manager manager = Manager.builder()
                    .user(managerUser)
                    .department("Operations & Member Services")
                    .build();
            managerRepository.save(manager);

            // 3. Trainer
            User trainerUser = User.builder()
                    .name("Ritik Joshi")
                    .email("trainer1@ironfit.in")
                    .phone("+91 98765 43212")
                    .password(defaultPassword)
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(trainerRole))
                    .build();
            userRepository.save(trainerUser);

            Trainer trainer = Trainer.builder()
                    .user(trainerUser)
                    .specialization("Strength & Conditioning")
                    .experienceYears(6)
                    .certifications("ACE Certified Personal Trainer, CSCS")
                    .rating(4.9)
                    .bio("Expert in heavy compound lifts, hypertrophy, and athletic conditioning.")
                    .monthlyRate(new BigDecimal("4999.00"))
                    .build();
            trainerRepository.save(trainer);

            // 4. Member 1 (Tinku)
            User memberUser1 = User.builder()
                    .name("Tinku Singh")
                    .email("tinku@ironfit.in")
                    .phone("+91 98765 43213")
                    .password(defaultPassword)
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(memberRole))
                    .build();
            userRepository.save(memberUser1);

            Member member1 = Member.builder()
                    .user(memberUser1)
                    .membershipNumber("IF-2026-001")
                    .emergencyContact("+91 98111 22233")
                    .gender("Male")
                    .dateOfBirth(LocalDate.of(1998, 5, 14))
                    .address("Civil Lines, Roorkee, Uttarakhand")
                    .weightKg(75.5)
                    .heightCm(178.0)
                    .bloodGroup("O+")
                    .assignedTrainer(trainer)
                    .build();
            memberRepository.save(member1);

            // 5. Member 2 (General Member)
            User memberUser2 = User.builder()
                    .name("Rahul Verma")
                    .email("member@ironfit.in")
                    .phone("+91 98765 43214")
                    .password(defaultPassword)
                    .status(UserStatus.ACTIVE)
                    .roles(Set.of(memberRole))
                    .build();
            userRepository.save(memberUser2);

            Member member2 = Member.builder()
                    .user(memberUser2)
                    .membershipNumber("IF-2026-002")
                    .emergencyContact("+91 98111 22244")
                    .gender("Male")
                    .dateOfBirth(LocalDate.of(1996, 8, 20))
                    .address("IIT Roorkee Campus, Uttarakhand")
                    .weightKg(70.0)
                    .heightCm(175.0)
                    .bloodGroup("B+")
                    .assignedTrainer(trainer)
                    .build();
            memberRepository.save(member2);
        }
    }

    private void initMembershipPlans() {
        if (membershipPlanRepository.count() == 0) {
            log.info("Seeding membership plans...");
            membershipPlanRepository.save(MembershipPlan.builder()
                    .title("Monthly Pass")
                    .description("Basic monthly access to all gym equipment and cardio zones.")
                    .durationMonths(1)
                    .priceInr(new BigDecimal("1499.00"))
                    .benefits("Full Gym Access, Locker Access, Free Diet Chart")
                    .isPopular(false)
                    .isActive(true)
                    .build());

            membershipPlanRepository.save(MembershipPlan.builder()
                    .title("Quarterly Fitness")
                    .description("3-month comprehensive fitness pass with trainer guidance.")
                    .durationMonths(3)
                    .priceInr(new BigDecimal("3999.00"))
                    .benefits("Full Gym Access, 2 Personal Trainer Sessions, Group Classes")
                    .isPopular(true)
                    .isActive(true)
                    .build());

            membershipPlanRepository.save(MembershipPlan.builder()
                    .title("Annual VIP Transformation")
                    .description("Full 12-month transformation plan with unlimited access.")
                    .durationMonths(12)
                    .priceInr(new BigDecimal("12999.00"))
                    .benefits("Unlimited Gym Access, Dedicated Personal Trainer, Body Composition Analysis, Sauna & Steam Access")
                    .isPopular(false)
                    .isActive(true)
                    .build());
        }
    }

    private void initGymSettings() {
        if (gymSettingRepository.count() == 0) {
            log.info("Seeding gym settings...");
            gymSettingRepository.save(GymSetting.builder()
                    .gymName("IronFit Gym & Fitness Club")
                    .address("Civil Lines, Roorkee, Uttarakhand - 247667")
                    .phone("+91 98765 43210")
                    .email("support@ironfit.in")
                    .openingHours("Mon - Sat: 5:00 AM - 10:00 PM | Sun: 6:00 AM - 1:00 PM")
                    .holidays("Holi, Diwali, Independence Day")
                    .upiId("ironfit@upi")
                    .build());
        }
    }
}
