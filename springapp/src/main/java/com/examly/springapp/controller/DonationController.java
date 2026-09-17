package com.examly.springapp.controller;

import com.examly.springapp.config.SwaggerConfig;
import com.examly.springapp.model.Donation;
import com.examly.springapp.service.DonationService;
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
@Tag(name = "Donation APIs")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
        }

        @PostMapping("/{campaignId}/donations")
        @Operation(summary = "Make a donation to a campaign")
        public ResponseEntity<Donation> makeDonation(
        @PathVariable Long campaignId,
        @Valid @RequestBody Donation donation) {

        Donation created =
        donationService.makeDonation(
            campaignId,
            donation);

            return new ResponseEntity<>(
                created,
                HttpStatus.CREATED);
                }

                @GetMapping("/{campaignId}/donations")
                @Operation(summary = "Get donations for a campaign")
                public ResponseEntity<List<Donation>> getDonationsForCampaign(
                @PathVariable Long campaignId) {

                return ResponseEntity.ok(
                    donationService.getDonationsForCampaign(
                        campaignId));
                    }
                }
                
