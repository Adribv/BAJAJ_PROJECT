import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Avatar,
  Chip,
  Skeleton,
  Divider,
  Tooltip,
  Rating,
  Button,
  IconButton,
  Fade,
  Grow,
  Zoom,
  alpha,
  InputAdornment,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';
import Background3D from '../components/Background3D';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

const PREDEFINED_SPECIALTIES = [
  'General Physician',
  'Dentist',
  'Dermatologist',
  'Paediatrician',
  'Gynaecologist',
  'ENT',
  'Diabetologist',
  'Cardiologist',
  'Physiotherapist',
  'Endocrinologist',
  'Orthopaedic',
  'Ophthalmologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Psychiatrist',
  'Urologist',
  'Dietitian/Nutritionist',
  'Psychologist',
  'Sexologist',
  'Nephrologist',
  'Neurologist',
  'Oncologist',
  'Ayurveda',
  'Homeopath'
];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#556B2F', // Olive green
      light: '#6B8E23',
      dark: '#2F4F2F',
    },
    secondary: {
      main: '#8B4513', // Saddle brown
      light: '#A0522D',
      dark: '#654321',
    },
    background: {
      default: '#0A0A0A',
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.dark, 0.2)})`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
  },
}));

const StyledCard = styled(Box)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.6)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(45deg, rgba(144, 169, 89, 0.1), transparent)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(144, 169, 89, 0.3)',
    '&::before': {
      opacity: 1,
    }
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #90A959, #556B2F)',
  color: '#ffffff',
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: '10px 24px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(144, 169, 89, 0.3)',
    '&::before': {
      left: '100%',
    }
  }
}));

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialtySearch, setSpecialtySearch] = useState('');

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Normalize the data
          const normalizedDoctors = data.map(doctor => ({
            ...doctor,
            consultationMode: doctor.video_consult ? 'Video Consult' : 'In Clinic',
            specialties: doctor.specialities.map(s => s.name)
          }));
          
          setDoctors(normalizedDoctors);
          setFilteredDoctors(normalizedDoctors);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        setError('Failed to fetch doctors data');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Apply filters based on URL params
  useEffect(() => {
    if (!doctors.length) return;

    let filtered = [...doctors];

    // Apply search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply consultation mode filter
    const mode = searchParams.get('mode');
    if (mode) {
      filtered = filtered.filter(doctor => {
        const doctorMode = doctor?.consultationMode;
        return doctorMode === mode;
      });
    }

    // Apply specialty filters
    const specialties = searchParams.getAll('specialty');
    if (specialties.length > 0) {
      filtered = filtered.filter(doctor => {
        const doctorSpecialties = (doctor?.specialties || []).map(s => s.toLowerCase());
        return specialties.some(specialty => 
          doctorSpecialties.includes(specialty.toLowerCase())
        );
      });
    }

    // Apply sorting
    const sortBy = searchParams.get('sort');
    if (sortBy === 'fees') {
      filtered.sort((a, b) => {
        const feeA = parseFloat(a?.fees?.replace(/[^0-9.-]+/g, '')) || 0;
        const feeB = parseFloat(b?.fees?.replace(/[^0-9.-]+/g, '')) || 0;
        return feeA - feeB;
      });
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a?.experience) || 0;
        const expB = parseInt(b?.experience) || 0;
        return expB - expA;
      });
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchParams]);

  // Handle consultation mode change
  const handleModeChange = (event) => {
    const params = new URLSearchParams(searchParams);
    const mode = event.target.value;
    if (mode) {
      params.set('mode', mode);
    } else {
      params.delete('mode');
    }
    setSearchParams(params);
  };

  // Handle specialty change
  const handleSpecialtyChange = (specialty) => {
    const params = new URLSearchParams(searchParams);
    const specialties = params.getAll('specialty');
    if (specialties.includes(specialty)) {
      params.delete('specialty', specialty);
    } else {
      params.append('specialty', specialty);
    }
    setSearchParams(params);
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    const params = new URLSearchParams(searchParams);
    if (sortBy) {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const filteredSpecialties = PREDEFINED_SPECIALTIES.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography color="text.secondary">
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        background: '#000000',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden'
      }}>
        <Background3D />
        
        {/* Search Bar Section */}
        <Box sx={{ 
          width: '100%', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1200,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(144, 169, 89, 0.1)',
          padding: '16px 24px',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(144, 169, 89, 0.3), transparent)',
          }
        }}>
          <Autocomplete
            freeSolo
            options={doctors.slice(0, 3).filter(doctor =>
              doctor?.name?.toLowerCase().includes((searchParams.get('search') || '').toLowerCase())
            )}
            getOptionLabel={(option) => option?.name || ''}
            onChange={(event, value) => {
              const params = new URLSearchParams(searchParams);
              if (value?.name) {
                params.set('search', value.name);
              } else {
                params.delete('search');
              }
              setSearchParams(params);
            }}
            onInputChange={(event, value) => {
              const params = new URLSearchParams(searchParams);
              if (value) {
                params.set('search', value);
              } else {
                params.delete('search');
              }
              setSearchParams(params);
            }}
            value={doctors.find(d => d?.name === searchParams.get('search')) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                fullWidth
                data-testid="autocomplete-input"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon sx={{ color: '#90A959', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '& input': {
                      color: '#ffffff'
                    }
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ p: 1.5 }} data-testid="suggestion-item">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={option?.photo}
                    sx={{ width: 40, height: 40, bgcolor: '#90A959' }}
                  >
                    {option?.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 500, color: '#ffffff' }}>
                      {option?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option?.specialties?.[0]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          width: '100%',
          padding: '24px',
          gap: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left Side - Filters */}
          <Box sx={{ 
            width: { xs: '100%', md: '280px' },
            flexShrink: 0,
            position: { xs: 'fixed', md: 'sticky' },
            top: { xs: 'auto', md: 80 },
            bottom: { xs: 0, md: 'auto' },
            left: 0,
            right: { xs: 0, md: 'auto' },
            zIndex: { xs: 1100, md: 1 },
            transform: { 
              xs: searchParams.size > 0 ? 'translateY(0)' : 'translateY(100%)',
              md: 'none'
            },
            transition: 'transform 0.3s ease-in-out',
            height: { xs: 'auto', md: 'fit-content' },
            maxHeight: { xs: '80vh', md: 'none' },
            overflowY: { xs: 'auto', md: 'visible' },
            padding: { xs: '16px', md: 0 }
          }}>
            <StyledCard sx={{ 
              padding: '24px',
              borderRadius: { xs: '12px 12px 0 0', md: 1 },
              boxShadow: { 
                xs: '0px -4px 20px rgba(0, 0, 0, 0.25)', 
                md: 'none' 
              }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 3 
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#ffffff',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}>
                  Filters
                </Typography>
                <Button
                  size="small"
                  onClick={clearAllFilters}
                  sx={{ 
                    color: '#90A959',
                    border: '1px solid #90A959',
                    fontSize: '0.75rem',
                    '&:hover': { 
                      backgroundColor: 'rgba(144, 169, 89, 0.1)',
                      border: '1px solid #90A959'
                    }
                  }}
                >
                  CLEAR ALL
                </Button>
              </Box>

              {/* Sort By Section */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}
                  data-testid="filter-header-sort"
                >
                  Sort by
                </Typography>
                <RadioGroup
                  value={searchParams.get('sort') || ''}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <FormControlLabel
                    value="fees"
                    control={
                      <Radio 
                        data-testid="sort-fees"
                        sx={{
                          color: '#90A959',
                          '&.Mui-checked': { color: '#90A959' }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: '#ffffff' }}>
                        Price: Low-High
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="experience"
                    control={
                      <Radio 
                        data-testid="sort-experience"
                        sx={{
                          color: '#90A959',
                          '&.Mui-checked': { color: '#90A959' }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: '#ffffff' }}>
                        Experience - Most Experience first
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>

              <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

              {/* Specialities Section */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}
                  data-testid="filter-header-speciality"
                >
                  Specialities
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search specialties..."
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      '& input': {
                        color: '#ffffff'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#90A959' }} fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box 
                  sx={{ 
                    maxHeight: '400px',
                    overflowY: 'auto',
                    pr: 1,
                    mt: 2,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(144, 169, 89, 0.5)',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(144, 169, 89, 0.7)',
                      }
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                    }
                  }}
                >
                  {filteredSpecialties.map((specialty) => (
                    <FormControlLabel
                      key={specialty}
                      control={
                        <Checkbox
                          checked={searchParams.getAll('specialty').includes(specialty)}
                          onChange={() => handleSpecialtyChange(specialty)}
                          data-testid={`filter-specialty-${specialty.replace(/[\s/]+/g, '-')}`}
                          sx={{
                            color: '#90A959',
                            '&.Mui-checked': { color: '#90A959' }
                          }}
                        />
                      }
                      label={
                        <Typography 
                          sx={{ 
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            maxWidth: '180px'
                          }}
                        >
                          {specialty}
                        </Typography>
                      }
                      sx={{ 
                        display: 'flex',
                        margin: '8px 0',
                        alignItems: 'center',
                        width: '100%',
                        '& .MuiCheckbox-root': {
                          padding: '4px 8px',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

              {/* Mode of Consultation */}
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}
                  data-testid="filter-header-moc"
                >
                  Mode of consultation
                </Typography>
                <RadioGroup
                  value={searchParams.get('mode') || ''}
                  onChange={handleModeChange}
                >
                  <FormControlLabel
                    value="Video Consult"
                    control={
                      <Radio 
                        data-testid="filter-video-consult"
                        sx={{
                          color: '#90A959',
                          '&.Mui-checked': { color: '#90A959' }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VideoCallIcon sx={{ color: '#90A959' }} />
                        <Typography sx={{ color: '#ffffff' }}>
                          Video Consultation
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="In Clinic"
                    control={
                      <Radio 
                        data-testid="filter-in-clinic"
                        sx={{
                          color: '#90A959',
                          '&.Mui-checked': { color: '#90A959' }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalHospitalIcon sx={{ color: '#90A959' }} />
                        <Typography sx={{ color: '#ffffff' }}>
                          In-clinic Consultation
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>
            </StyledCard>
          </Box>

          {/* Right Side - Doctor Cards */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            mb: { xs: '80px', md: 0 },
            width: '100%'
          }}>
            <Grid container spacing={2}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <Grow
                    in={true}
                    timeout={300 + index * 100}
                    key={doctor?.id}
                  >
                    <Grid item xs={12}>
                      <StyledCard sx={{ 
                        padding: '24px',
                        width: '100%'
                      }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Box sx={{ display: 'flex', gap: '16px' }}>
                              <Avatar
                                src={doctor?.photo}
                                sx={{ 
                                  width: { xs: 64, md: 80 },
                                  height: { xs: 64, md: 80 },
                                  bgcolor: '#90A959',
                                  border: '2px solid rgba(144, 169, 89, 0.3)',
                                  transition: 'all 0.4s ease',
                                  position: 'relative',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -4,
                                    left: -4,
                                    right: -4,
                                    bottom: -4,
                                    border: '2px solid rgba(144, 169, 89, 0.2)',
                                    borderRadius: '50%',
                                    animation: 'pulse 2s infinite',
                                  },
                                  '@keyframes pulse': {
                                    '0%': {
                                      transform: 'scale(1)',
                                      opacity: 0.8,
                                    },
                                    '50%': {
                                      transform: 'scale(1.1)',
                                      opacity: 0.4,
                                    },
                                    '100%': {
                                      transform: 'scale(1)',
                                      opacity: 0.8,
                                    },
                                  },
                                  '&:hover': {
                                    transform: 'scale(1.1) rotate(5deg)',
                                    border: '2px solid rgba(144, 169, 89, 0.8)',
                                    boxShadow: '0 0 20px rgba(144, 169, 89, 0.3)',
                                  }
                                }}
                              >
                                {doctor?.name?.[0]}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  data-testid="doctor-name"
                                  sx={{ 
                                    fontWeight: 600,
                                    color: '#ffffff',
                                    mb: 1,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                    transition: 'color 0.3s ease',
                                    '&:hover': {
                                      color: '#90A959'
                                    }
                                  }}
                                >
                                  {doctor?.name}
                                </Typography>
                                <Typography 
                                  color="rgba(255, 255, 255, 0.7)"
                                  data-testid="doctor-specialty"
                                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                                >
                                  {doctor?.specialties?.join(', ')}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  color="rgba(255, 255, 255, 0.7)" 
                                  sx={{ 
                                    mt: 0.5,
                                    fontSize: { xs: '0.8rem', md: '0.875rem' }
                                  }}
                                >
                                  {doctor?.qualifications}
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px',
                                  mt: 1 
                                }}>
                                  <WorkIcon sx={{ color: '#90A959', fontSize: '1rem' }} />
                                  <Typography 
                                    variant="body2"
                                    data-testid="doctor-experience"
                                    sx={{ 
                                      color: '#ffffff',
                                      fontSize: { xs: '0.8rem', md: '0.875rem' }
                                    }}
                                  >
                                    {doctor?.experience} yrs exp
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ 
                              display: 'flex',
                              flexDirection: { xs: 'row', sm: 'column' },
                              justifyContent: { xs: 'space-between', sm: 'flex-end' },
                              alignItems: { xs: 'center', sm: 'flex-end' },
                              height: '100%',
                              gap: '16px'
                            }}>
                              <Typography 
                                variant="h6"
                                data-testid="doctor-fee"
                                sx={{ 
                                  fontWeight: 600,
                                  color: '#90A959',
                                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                                }}
                              >
                                ₹{doctor?.fees}
                              </Typography>
                              <StyledButton>
                                Book Appointment
                              </StyledButton>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              mt: 2,
                              opacity: 0.7,
                              transition: 'opacity 0.3s ease',
                              '&:hover': {
                                opacity: 1
                              }
                            }}>
                              <LocationOnIcon sx={{ color: '#90A959' }} />
                              <Typography 
                                variant="body2" 
                                color="rgba(255, 255, 255, 0.7)"
                                sx={{ 
                                  fontSize: { xs: '0.8rem', md: '0.875rem' },
                                  flex: 1
                                }}
                              >
                                {doctor?.clinic?.name && (
                                  <>
                                    {doctor.clinic.name}
                                    {doctor.clinic.locality && `, ${doctor.clinic.locality}`}
                                    {doctor.clinic.city && `, ${doctor.clinic.city}`}
                                  </>
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </StyledCard>
                    </Grid>
                  </Grow>
                ))
              ) : (
                <Grid item xs={12}>
                  <StyledCard sx={{ 
                    padding: '32px',
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    <Typography 
                      variant="h6" 
                      color="rgba(255, 255, 255, 0.7)" 
                      sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      No doctors found matching your criteria
                    </Typography>
                  </StyledCard>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DoctorListing;