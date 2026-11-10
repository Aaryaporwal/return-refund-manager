
package com.aarya.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

@Entity
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String productName;
    private String reason;
    private String status;
    private LocalDate purchaseDate;

    // Default constructor
    public ReturnRequest() {
    }

    // Parameterized constructor
    public ReturnRequest(String customerName, String productName,
                         String reason, String status,
                         LocalDate purchaseDate) {

        this.customerName = clean(customerName);
        this.productName = clean(productName);
        this.reason = clean(reason);
        this.status = normalizeStatus(status);
        this.purchaseDate = purchaseDate;
    }

    // Clean unnecessary whitespace
    private String clean(String value) {
        return value == null ? null : value.trim();
    }

    // Standardize status
    private String normalizeStatus(String status) {
        return status == null ? "REQUESTED" :
                status.trim().toUpperCase(Locale.ROOT);
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getProductName() {
        return productName;
    }

    public String getReason() {
        return reason;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    // Setters
    public void setCustomerName(String customerName) {
        this.customerName = clean(customerName);
    }

    public void setProductName(String productName) {
        this.productName = clean(productName);
    }

    public void setReason(String reason) {
        this.reason = clean(reason);
    }

    public void setStatus(String status) {
        this.status = normalizeStatus(status);
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    // Check return eligibility
    public boolean isEligibleForReturn() {

        if (purchaseDate == null) {
            return false;
        }

        LocalDate today = LocalDate.now();

        long daysPassed = ChronoUnit.DAYS.between(
                purchaseDate, today
        );

        return daysPassed >= 0 && daysPassed <= 7;
    }
}
