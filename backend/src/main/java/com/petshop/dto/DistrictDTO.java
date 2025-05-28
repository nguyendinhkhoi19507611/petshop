package com.petshop.dto;

public class DistrictDTO {
    private Long id;
    private String districtName;
    private Long provinceId;

    // Constructors
    public DistrictDTO() {}

    public DistrictDTO(Long id, String districtName, Long provinceId) {
        this.id = id;
        this.districtName = districtName;
        this.provinceId = provinceId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }
}
