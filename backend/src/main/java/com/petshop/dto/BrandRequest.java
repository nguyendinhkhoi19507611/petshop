package com.petshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class BrandRequest {
    @NotBlank(message = "Tên thương hiệu không được để trống")
    @Size(min = 2, max = 50, message = "Tên thương hiệu phải từ 2-50 ký tự")
    private String brandName;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    private String logoUrl;

    @Pattern(regexp = "^(https?://).*", message = "Website phải bắt đầu bằng http:// hoặc https://")
    private String website;

    private Boolean status = true;

    // Constructors
    public BrandRequest() {}

    public BrandRequest(String brandName, String description) {
        this.brandName = brandName;
        this.description = description;
        this.status = true;
    }

    // Getters and Setters
    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}