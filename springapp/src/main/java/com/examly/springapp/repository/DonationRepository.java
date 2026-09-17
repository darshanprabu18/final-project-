package com.examly.springapp.repository;

import com.examly.springapp.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository
extends JpaRepository<Donation, Long> {

    List<Donation> findByCampaignIdOrderByIdDesc(
        Long campaignId);
    }
    