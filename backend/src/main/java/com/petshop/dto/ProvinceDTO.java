package com.petshop.dto;

public class ProvinceDTO {
    private Long id;
    private String provinceName;

    // Constructors
    public ProvinceDTO() {}

    public ProvinceDTO(Long id, String provinceName) {
        this.id = id;
        this.provinceName = provinceName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }
}