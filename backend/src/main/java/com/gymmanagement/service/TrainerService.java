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
}
