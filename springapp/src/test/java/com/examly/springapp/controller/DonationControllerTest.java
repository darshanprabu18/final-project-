package com.examly.springapp.controller;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.Donation;
import com.examly.springapp.repository.CampaignRepository;
import com.examly.springapp.repository.DonationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class DonationControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private CampaignRepository campaignRepository;
    @Autowired
    private DonationRepository donationRepository;

    Campaign makeValidCampaign() {
        Campaign c = new Campaign();
        c.setTitle("Donate Campaign");
        c.setDescription("A campaign description used for donation test.");
        c.setGoalAmount(new BigDecimal("1000.00"));
        c.setCategory("Medical");
        c.setCreatorName("Eve");
        c.setDeadline(LocalDate.now().plusDays(10));
        return campaignRepository.save(c);
    }

    @BeforeEach
    void clearData() {
        donationRepository.deleteAll();
        campaignRepository.deleteAll();
    }

    @Test
    @WithMockUser
    void controller_testMakeDonation_ValidAndStatusUpdates() throws Exception {
        Campaign c = makeValidCampaign();
        Donation d = new Donation();
        d.setAmount(new BigDecimal("200.00"));
        d.setDonorName("DonorPerson");
        d.setMessage("Best wishes!");
        String json = objectMapper.writeValueAsString(d);
        mockMvc.perform(post("/api/campaigns/"+c.getId()+"/donations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.amount", is(200.00)))
                .andExpect(jsonPath("$.donorName", is("DonorPerson")))
                .andExpect(jsonPath("$.message", is("Best wishes!")))
                .andExpect(jsonPath("$.campaignId").doesNotExist()); // We don't render campaignId in entity
    }

    @Test
    @WithMockUser
    void controller_testMakeDonationToInactiveCampaign() throws Exception {
        Campaign c = makeValidCampaign();
        // Expire the campaign
        c.setDeadline(LocalDate.now().minusDays(1));
        campaignRepository.save(c);
        Donation d = new Donation();
        d.setAmount(new BigDecimal("40.00"));
        d.setDonorName("Bob");
        String json = objectMapper.writeValueAsString(d);
        mockMvc.perform(post("/api/campaigns/"+c.getId()+"/donations")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message", containsString("not ACTIVE")));
    }
    
    @Test
    void controller_testGetDonationsForCampaign() throws Exception {
        Campaign c = makeValidCampaign();
        Donation d = new Donation();
        d.setAmount(new BigDecimal("30.00"));
        d.setDonorName("Alice");
        d.setCampaign(c);
        donationRepository.save(d);
        mockMvc.perform(get("/api/campaigns/"+c.getId()+"/donations"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
}
