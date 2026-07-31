package com.gymmanagement.service;

import com.gymmanagement.entity.Trainer;
import com.gymmanagement.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;

    @Transactional(readOnly = true)
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Trainer getTrainerById(Long id) {
        return trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + id));
    }

    @Transactional
    public Trainer createTrainer(com.gymmanagement.dto.CreateTrainerRequest request, com.gymmanagement.repository.UserRepository userRepository, com.gymmanagement.repository.RoleRepository roleRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        var role = roleRepository.findByName("ROLE_TRAINER")
                .orElseGet(() -> roleRepository.save(com.gymmanagement.entity.Role.builder().name("ROLE_TRAINER").build()));
        
        var user = com.gymmanagement.entity.User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode("Password@123"))
                .status("ACTIVE")
                .roles(java.util.Set.of(role))
                .build();
        var savedUser = userRepository.save(user);

        var trainer = Trainer.builder()
                .user(savedUser)
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 3)
                .certifications(request.getCertifications() != null ? request.getCertifications() : "Certified Fitness Trainer")
                .bio(request.getBio() != null ? request.getBio() : "Expert gym trainer.")
                .build();

        return trainerRepository.save(trainer);
    }
}
