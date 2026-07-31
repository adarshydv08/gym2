package com.gymmanagement.service;

import com.gymmanagement.entity.Manager;
import com.gymmanagement.entity.User;
import com.gymmanagement.repository.ManagerRepository;
import com.gymmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;

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

    @Transactional
    public Manager approveManager(Long managerId) {
        Manager manager = managerRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + managerId));
        
        User user = manager.getUser();
        if ("PENDING".equals(user.getStatus())) {
            user.setStatus("ACTIVE");
            userRepository.save(user);
        }
        return manager;
    }
}
