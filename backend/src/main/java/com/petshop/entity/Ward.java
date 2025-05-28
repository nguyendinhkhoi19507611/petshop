package com.petshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "xa")
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_xa")
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "ten_xa", length = 50)
    private String wardName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_huyen")
    private District district;

    // Constructors
    public Ward() {}

    public Ward(String wardName, District district) {
        this.wardName = wardName;
        this.district = district;
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

    public District getDistrict() {
        return district;
    }

    public void setDistrict(District district) {
        this.district = district;
    }
}