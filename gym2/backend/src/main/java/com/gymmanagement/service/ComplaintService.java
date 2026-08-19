package com.gymmanagement.service;

import com.gymmanagement.entity.Complaint;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.ComplaintRepository;
import com.gymmanagement.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Complaint> getMemberComplaints(Long memberId) {
        return complaintRepository.findByMemberId(memberId);
    }

    @Transactional
    public Complaint createComplaint(Long memberId, String subject, String description, String category, String priority) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));

        Complaint complaint = Complaint.builder()
                .member(member)
                .subject(subject)
                .description(description)
                .category((category != null) ? category : "General")
                .priority((priority != null) ? priority : "MEDIUM")
                .status("OPEN")
                .build();

        return complaintRepository.save(complaint);
    }

    @Transactional
    public Complaint updateComplaintStatus(Long complaintId, String status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    @Transactional
    public void deleteComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + complaintId));
        complaintRepository.delete(complaint);
    }
}
