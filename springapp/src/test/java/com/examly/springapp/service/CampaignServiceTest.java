package com.examly.springapp.service;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import com.examly.springapp.repository.CampaignRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;

    @InjectMocks
    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateCampaign_Valid() {
        Campaign c = new Campaign();
        c.setTitle("Valid Title");
        c.setDescription("This is a campaign for raising funds.");
        c.setGoalAmount(new BigDecimal("500.00"));
        c.setDeadline(LocalDate.now().plusDays(10));
        c.setCategory("Animals");
        c.setCreatorName("Alice");
        when(campaignRepository.save(any(Campaign.class))).thenAnswer(i -> i.getArguments()[0]);

        Campaign created = campaignService.createCampaign(c);
        assertEquals(CampaignStatus.ACTIVE, created.getStatus());
        assertEquals("Animals", created.getCategory());
    }

    @Test
    void testCreateCampaign_PastDeadline() {
        Campaign c = new Campaign();
        c.setTitle("Past Deadline");
        c.setDescription("Test desc that is long enough.");
        c.setGoalAmount(new BigDecimal("200.00"));
        c.setDeadline(LocalDate.now().minusDays(2));
        c.setCategory("Education");
        c.setCreatorName("Raj");
        Exception ex = assertThrows(ValidationException.class, () -> campaignService.createCampaign(c));
        assertTrue(ex.getMessage().contains("Deadline must be a future date"));
    }

    @Test
    void testGetCampaignById_NotFound() {
        when(campaignRepository.findById(100L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> campaignService.getCampaignById(100L));
    }

    @Test
    void testCampaignStatusCompleted() {
        Campaign c = new Campaign();
        c.setId(1L);
        c.setTitle("Valid Title");
        c.setDescription("This is a campaign for raising funds.");
        c.setGoalAmount(new BigDecimal("1000.00"));
        c.setDeadline(LocalDate.now().plusDays(10));
        c.setCategory("Animals");
        c.setCreatorName("Alice");
        c.setCurrentAmount(new BigDecimal("1200.00"));
        c.setStatus(CampaignStatus.ACTIVE);
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(c));
        when(campaignRepository.save(any(Campaign.class))).thenAnswer(i -> i.getArguments()[0]);
        campaignService.updateCampaignStatusIfNeeded(c);
        assertEquals(CampaignStatus.COMPLETED, c.getStatus());
    }
}
