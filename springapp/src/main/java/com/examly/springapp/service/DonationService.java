package com.examly.springapp.service;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import com.examly.springapp.model.Donation;
import com.examly.springapp.repository.CampaignRepository;
import com.examly.springapp.repository.DonationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final CampaignRepository campaignRepository;
    private final CampaignService campaignService;

    public DonationService(
        DonationRepository donationRepository,
        CampaignRepository campaignRepository,
        CampaignService campaignService) {

            this.donationRepository = donationRepository;
            this.campaignRepository = campaignRepository;
            this.campaignService = campaignService;
        }

        public Donation makeDonation(
            Long campaignId,
            Donation donation) {

                Campaign campaign = campaignRepository
                .findById(campaignId)
                .orElseThrow(() ->
            new EntityNotFoundException(
                "Campaign not found"));

                campaignService.updateCampaignStatusIfNeeded(campaign);

                if (campaign.getStatus() != CampaignStatus.ACTIVE) {
                    throw new ValidationException(
                    "Campaign is not ACTIVE");
                }

                donation.setCampaign(campaign);

                campaign.setCurrentAmount(
                    campaign.getCurrentAmount()
                    .add(donation.getAmount())
                );

                campaignRepository.save(campaign);

                campaignService.updateCampaignStatusIfNeeded(campaign);

                return donationRepository.save(donation);
                }

                public List<Donation> getDonationsForCampaign(
                    Long campaignId) {

                        if (!campaignRepository.existsById(campaignId)) {
                            throw new EntityNotFoundException(
                            "Campaign not found");
                            }

                            return donationRepository
                            .findByCampaignIdOrderByIdDesc(campaignId);
                            }
                        }
                        