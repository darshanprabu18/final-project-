package com.examly.springapp.controller;

import com.examly.springapp.model.Campaign;
import com.examly.springapp.model.CampaignStatus;
import com.examly.springapp.service.CampaignService;
import com.examly.springapp.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@Tag(name = "Campaign APIs")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class CampaignController {

private final CampaignService campaignService;

public CampaignController(CampaignService campaignService) {
    this.campaignService = campaignService;
    }

    @PostMapping
    @Operation(summary = "Create a campaign")
    public ResponseEntity<Campaign> createCampaign(
        @Valid @RequestBody Campaign campaign) {

        Campaign created = campaignService.createCampaign(campaign);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
        }

        @GetMapping
        @Operation(summary = "Get all campaigns")
        public ResponseEntity<List<Campaign>> getAllCampaigns(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) CampaignStatus status) {

            List<Campaign> campaigns =
            campaignService.getAllCampaigns(category, status);

            return ResponseEntity.ok(campaigns);
            }

            @GetMapping("/{id}")
            @Operation(summary = "Get a campaign by id")
            public ResponseEntity<Campaign> getCampaignById(
                @PathVariable Long id) {

                    return ResponseEntity.ok(
                        campaignService.getCampaignById(id));
                        }
                    }
                    
