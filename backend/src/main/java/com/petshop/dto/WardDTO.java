package com.petshop.dto;

public class WardDTO {
    private Long id;
    private String wardName;
    private Long districtId;

    // Constructors
    public WardDTO() {}

    public WardDTO(Long id, String wardName, Long districtId) {
        this.id = id;
        this.wardName = wardName;
        this.districtId = districtId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }
}