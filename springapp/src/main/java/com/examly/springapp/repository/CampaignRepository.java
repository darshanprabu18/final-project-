package com.examly.springapp.repository;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository
extends JpaRepository<Campaign, Long> {

    List<Campaign> findByCategory(String category);

    List<Campaign> findByStatus(CampaignStatus status);

    List<Campaign> findByCategoryAndStatus(
        String category,
        CampaignStatus status);
    }
    