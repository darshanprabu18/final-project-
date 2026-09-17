package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title must be between 5 and 100 characters")
    @Size(min = 5, max = 100,
            message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description must be between 20 and 500 characters")
    @Size(min = 20, max = 500,
            message = "Description must be between 20 and 500 characters")
    @Column(length = 500)
    private String description;

    @NotNull(message = "Goal amount is required")
    @DecimalMin(value = "100.00",
            message = "Goal amount must be at least 100.00")
    private BigDecimal goalAmount;

    private BigDecimal currentAmount = BigDecimal.ZERO;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Creator name is required")
    @Size(max = 100,
            message = "Creator name must not exceed 100 characters")
    private String creatorName;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    @OneToMany(
            mappedBy = "campaign",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JsonManagedReference
    private List<Donation> donations;

    public Campaign() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (currentAmount == null) {
            currentAmount = BigDecimal.ZERO;
        }

        if (status == null) {
            status = CampaignStatus.ACTIVE;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getGoalAmount() {
        return goalAmount;
    }

    public void setGoalAmount(BigDecimal goalAmount) {
        this.goalAmount = goalAmount;
    }

    public BigDecimal getCurrentAmount() {
        return currentAmount;
    }

    public void setCurrentAmount(BigDecimal currentAmount) {
        this.currentAmount = currentAmount;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
    }

    public List<Donation> getDonations() {
        return donations;
    }

    public void setDonations(List<Donation> donations) {
        this.donations = donations;
    }
}