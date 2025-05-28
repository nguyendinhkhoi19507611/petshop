import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Box,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { ExpandMore, FilterList, Clear } from '@mui/icons-material';
import CategorySelector from '../category/CategorySelector';
import BrandSelector from '../brand/BrandSelector';
import SizeSelector from '../size/SizeSelector';

const ProductFilter = ({ 
  onFilterChange, 
  onClear,
  initialFilters = {},
  className = ''
}) => {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    brandId: '',
    sizeId: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    featured: false,
    inStock: false,
    onSale: false,
    tags: [],
    sortBy: 'createdDate',
    sortDir: 'desc',
    ...initialFilters
  });

  const [priceRange, setPriceRange] = useState([0, 10000000]); // 0 - 10M VND
  const [expanded, setExpanded] = useState('basic');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setFilters(prev => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    }));
  };

  const handleClear = () => {
    const defaultFilters = {
      search: '',
      categoryId: '',
      brandId: '',
      sizeId: '',
      minPrice: '',
      maxPrice: '',
      status: '',
      featured: false,
      inStock: false,
      onSale: false,
      tags: [],
      sortBy: 'createdDate',
      sortDir: 'desc',
    };
    
    setFilters(defaultFilters);
    setPriceRange([0, 10000000]);
    onClear();
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.brandId) count++;
    if (filters.sizeId) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.status) count++;
    if (filters.featured) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  return (
    <Card className={className}>
      <CardContent>
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center space-x-2">
            <FilterList />
            <Typography variant="h6" className="font-semibold">
              Bộ lọc
            </Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={getActiveFiltersCount()} 
                color="primary" 
                size="small" 
              />
            )}
          </Box>
          
          <Button
            startIcon={<Clear />}
            onClick={handleClear}
            disabled={getActiveFiltersCount() === 0}
            size="small"
          >
            Xóa bộ lọc
          </Button>
        </Box>

        {/* Basic Filters */}
        <Accordion 
          expanded={expanded === 'basic'} 
          onChange={() => setExpanded(expanded === 'basic' ? false : 'basic')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Bộ lọc cơ bản</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tìm kiếm sản phẩm"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Nhập tên sản phẩm, SKU..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CategorySelector
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  label="Danh mục"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <BrandSelector
                  value={filters.brandId}
                  onChange={(e) => handleFilterChange('brandId', e.target.value)}
                  label="Thương hiệu"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SizeSelector
                  value={filters.sizeId}
                  onChange={(e) => handleFilterChange('sizeId', e.target.value)}
                  label="Kích cỡ"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Trạng thái"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="true">Đang bán</MenuItem>
                    <MenuItem value="false">Ngừng bán</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Price Filter */}
        <Accordion 
          expanded={expanded === 'price'} 
          onChange={() => setExpanded(expanded === 'price' ? false : 'price')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Khoảng giá</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="px-2">
              <Typography variant="body2" className="mb-4 text-center">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} VNĐ
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000000}
                step={100000}
                valueLabelFormat={(value) => `${formatPrice(value)} VNĐ`}
                marks={[
                  { value: 0, label: '0' },
                  { value: 2500000, label: '2.5M' },
                  { value: 5000000, label: '5M' },
                  { value: 10000000, label: '10M' },
                ]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Filters */}
        <Accordion 
          expanded={expanded === 'advanced'} 
          onChange={() => setExpanded(expanded === 'advanced' ? false : 'advanced')}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Bộ lọc nâng cao</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    />
                  }
                  label="Sản phẩm nổi bật"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    />
                  }
                  label="Còn hàng"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.onSale}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    />
                  }
                  label="Đang khuyến mãi"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Sắp xếp theo</InputLabel>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    label="Sắp xếp theo"
                  >
                    <MenuItem value="createdDate">Ngày tạo</MenuItem>
                    <MenuItem value="productName">Tên sản phẩm</MenuItem>
                    <MenuItem value="price">Giá bán</MenuItem>
                    <MenuItem value="soldQuantity">Lượng bán</MenuItem>
                    <MenuItem value="stock">Tồn kho</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Thứ tự</InputLabel>
                  <Select
                    value={filters.sortDir}
                    onChange={(e) => handleFilterChange('sortDir', e.target.value)}
                    label="Thứ tự"
                  >
                    <MenuItem value="asc">Tăng dần</MenuItem>
                    <MenuItem value="desc">Giảm dần</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProductFilter;