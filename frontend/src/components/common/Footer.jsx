import React from 'react';
import { Box, Typography, Container, Grid, Link } from '@mui/material';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <Box
      component="footer"
      className="bg-gray-800 text-white mt-auto"
      sx={{ py: 6 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4">
              Pet Shop
            </Typography>
            <Typography variant="body2" className="text-gray-300 mb-4">
              Cửa hàng thú cưng uy tín, cung cấp thức ăn và phụ kiện chất lượng cao cho thú cưng của bạn.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4">
              Sản phẩm
            </Typography>
            <Box className="space-y-2">
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Thức ăn cho chó
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Thức ăn cho mèo
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Phụ kiện thú cưng
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Đồ chơi
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4">
              Hỗ trợ
            </Typography>
            <Box className="space-y-2">
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Liên hệ
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Hướng dẫn mua hàng
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                Chính sách đổi trả
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-semibold mb-4">
              Liên hệ
            </Typography>
            <Box className="space-y-2">
              <Typography variant="body2" className="text-gray-300">
                ✉️ info@petshop.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box className="border-t border-gray-700 mt-8 pt-6">
          <Typography variant="body2" className="text-center text-gray-300">
            <Box className="flex items-center justify-center">
              © 2025 Pet Shop. Made with{' '}
              <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" />
              {' '}by Pet Shop Team
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;