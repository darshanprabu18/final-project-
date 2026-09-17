package com.examly.springapp.controller;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import com.examly.springapp.repository.CampaignRepository;
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
import java.util.List;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CampaignControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private CampaignRepository campaignRepository;

    Campaign validCampaign() {
        Campaign c = new Campaign();
        c.setTitle("Test Campaign");
        c.setDescription("This is a detailed sample description for a campaign.");
        c.setGoalAmount(new BigDecimal("700.00"));
        c.setCategory("Animals");
        c.setCreatorName("John Test");
        c.setDeadline(LocalDate.now().plusDays(10));
        return c;
    }

    @BeforeEach
    void cleanup() { campaignRepository.deleteAll(); }

    @Test
    @WithMockUser
    void controller_testCreateCampaign_Valid() throws Exception {
        Campaign c = validCampaign();
        String json = objectMapper.writeValueAsString(c);
        mockMvc.perform(post("/api/campaigns")
                .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status", is("ACTIVE")));
    }

    @Test
    @WithMockUser
    void controller_testCreateCampaign_ValidationFails() throws Exception {
        Campaign c = new Campaign();
        c.setTitle("ABC"); // Too short
        c.setDescription("This is a valid long description for campaign validation testing.");
        c.setGoalAmount(new BigDecimal("500.00"));
        c.setCreatorName("Valid Creator");
        c.setDeadline(LocalDate.now().plusDays(10));
        c.setCategory("Animals");
        mockMvc.perform(post("/api/campaigns")
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(c)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Title must be between 5 and 100 characters")));
    }

    @Test
    void controller_testGetAllCampaignsAndFilter() throws Exception {
        Campaign c1 = validCampaign();
        c1.setCategory("Animals");
        campaignRepository.save(c1);
        Campaign c2 = validCampaign();
        c2.setCategory("Education");
        campaignRepository.save(c2);
        mockMvc.perform(get("/api/campaigns?category=Animals"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].category", is("Animals")));
    }

    @Test
    void controller_testGetCampaignById_NotFound() throws Exception {
        mockMvc.perform(get("/api/campaigns/111111"))
            .andExpect(status().isNotFound());
    }
}
