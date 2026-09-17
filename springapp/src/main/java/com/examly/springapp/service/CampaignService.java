package com.examly.springapp.service;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import com.examly.springapp.repository.CampaignRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
        }

        public Campaign createCampaign(Campaign campaign) {

            if (campaign.getDeadline() == null ||
        !campaign.getDeadline().isAfter(LocalDate.now())) {
        
        throw new ValidationException(
            "Deadline must be a future date");
        }

        campaign.setCurrentAmount(BigDecimal.ZERO);
        campaign.setStatus(CampaignStatus.ACTIVE);
        campaign.setCreatedAt(LocalDateTime.now());

        return campaignRepository.save(campaign);
    }

    public Campaign getCampaignById(Long id) {

        Campaign campaign = campaignRepository.findById(id)
        .orElseThrow(() ->
        new EntityNotFoundException("Campaign not found"));

        updateCampaignStatusIfNeeded(campaign);

        return campaign;
    }

    public List<Campaign> getAllCampaigns(
        String category,
        CampaignStatus status) {

            if (category != null && status != null) {
                return campaignRepository
                .findByCategoryAndStatus(category, status);
                }

                if (category != null) {
                    return campaignRepository.findByCategory(category);
                    }

                    if (status != null) {
                        return campaignRepository.findByStatus(status);
                        }

                        return campaignRepository.findAll();
                    }

                    public void updateCampaignStatusIfNeeded(
                        Campaign campaign) {

                            if (campaign.getCurrentAmount() != null &&
                        campaign.getGoalAmount() != null &&
                        campaign.getCurrentAmount()
                    .compareTo(campaign.getGoalAmount()) >= 0) {
                    
                    campaign.setStatus(CampaignStatus.COMPLETED);
                }
                else if (campaign.getDeadline() != null &&
            campaign.getDeadline()
            .isBefore(LocalDate.now())) {

                campaign.setStatus(CampaignStatus.EXPIRED);
                }

                campaignRepository.save(campaign);
            }
        }
        