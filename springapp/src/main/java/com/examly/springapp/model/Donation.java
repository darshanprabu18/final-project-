package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00",
            message = "Donation amount must be at least 1.00")
    private BigDecimal amount;

    @NotBlank(message = "Donor name is required")
    @Size(max = 100,
            message = "Donor name must not exceed 100 characters")
    private String donorName;

    @Size(max = 500,
            message = "Message must not exceed 500 characters")
    @Column(length = 500)
    private String message;

    private LocalDateTime donatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    @JsonBackReference
    private Campaign campaign;

    public Donation() {
    }

    @PrePersist
    public void prePersist() {
        if (donatedAt == null) {
            donatedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDonatedAt() {
        return donatedAt;
    }

    public void setDonatedAt(LocalDateTime donatedAt) {
        this.donatedAt = donatedAt;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }
}