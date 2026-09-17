package com.examly.springapp.service;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import com.examly.springapp.model.Donation;
import com.examly.springapp.repository.CampaignRepository;
import com.examly.springapp.repository.DonationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DonationServiceTest {
    @Mock
    private DonationRepository donationRepository;
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private CampaignService campaignService;
    @InjectMocks
    private DonationService donationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testMakeDonation_Success() {
        Campaign c = new Campaign();
        c.setId(1L);
        c.setTitle("Animals");
        c.setCurrentAmount(new BigDecimal("200.00"));
        c.setGoalAmount(new BigDecimal("500.00"));
        c.setStatus(CampaignStatus.ACTIVE);
        Donation d = new Donation();
        d.setAmount(new BigDecimal("50.00"));
        d.setDonorName("DonorX");
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(c));
        when(donationRepository.save(any(Donation.class))).thenAnswer(i -> i.getArguments()[0]);

        Donation result = donationService.makeDonation(1L, d);
        assertEquals("DonorX", result.getDonorName());
        assertEquals(new BigDecimal("250.00"), c.getCurrentAmount());
    }

    @Test
    void testMakeDonation_ExpiredOrCompletedFails() {
        Campaign c = new Campaign();
        c.setId(2L);
        c.setStatus(CampaignStatus.EXPIRED);
        Donation d = new Donation();
        d.setAmount(new BigDecimal("30.00"));
        d.setDonorName("Nope");
        when(campaignRepository.findById(2L)).thenReturn(Optional.of(c));
        Exception ex = assertThrows(ValidationException.class, () -> donationService.makeDonation(2L, d));
        assertTrue(ex.getMessage().contains("not ACTIVE"));
    }

    @Test
    void testGetDonationsForCampaign_NotFound() {
        when(campaignRepository.existsById(5L)).thenReturn(false);
        assertThrows(EntityNotFoundException.class, () -> donationService.getDonationsForCampaign(5L));
    }
}
