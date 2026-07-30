package com.gymmanagement.service;

import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Member getMemberByUserId(Long userId) {
        return memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Member profile not found for user id: " + userId));
    }

    @Transactional
    public Member updateMemberStatus(Long id, String status) {
        Member member = getMemberById(id);
        member.setStatus(status);
        return memberRepository.save(member);
    }
}
