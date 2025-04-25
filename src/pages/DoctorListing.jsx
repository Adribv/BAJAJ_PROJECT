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

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.dark, 0.2)})`,
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
  },
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

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState([]);
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

  // Handle search input changes
  const handleSearchChange = (event, value) => {
    if (value) {
      const matches = doctors
        .filter(doctor =>
          doctor?.name?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // Handle search selection
  const handleSearchSelect = (event, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value.name);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

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
    setSuggestions([]);
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
        flexDirection: 'column'
      }}>
        {/* Search Bar Section */}
        <Box sx={{ 
          width: '100%', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1200,
          background: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          py: { xs: 1.5, md: 2 },
          px: { xs: 1.5, md: 2 }
        }}>
          <Autocomplete
            freeSolo
            options={doctors}
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
              if (!value) {
                const params = new URLSearchParams(searchParams);
                params.delete('search');
                setSearchParams(params);
              }
            }}
            value={doctors.find(d => d?.name === searchParams.get('search')) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon sx={{ color: '#90A959', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    }
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ 
                p: 1.5,
                '&:hover': { backgroundColor: 'rgba(144, 169, 89, 0.1)' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={option?.photo}
                    sx={{ 
                      width: 40,
                      height: 40,
                      bgcolor: '#90A959'
                    }}
                  >
                    {option?.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
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
          gap: { xs: 1.5, md: 2 },
          p: { xs: 1.5, md: 2 }
        }}>
          {/* Left Side - Filters */}
          <Box sx={{ 
            width: { xs: '100%', md: 280 },
            flexShrink: 0,
            position: { xs: 'fixed', md: 'sticky' },
            top: { xs: 'auto', md: 80 },
            bottom: { xs: 0, md: 'auto' },
            left: { xs: 0, md: 'auto' },
            zIndex: { xs: 1100, md: 1 },
            transform: { 
              xs: searchParams.size > 0 ? 'translateY(0)' : 'translateY(100%)',
              md: 'none'
            },
            transition: 'transform 0.3s ease-in-out',
            height: { xs: 'auto', md: 'fit-content' },
            maxHeight: { xs: '80vh', md: 'none' },
            overflowY: { xs: 'auto', md: 'visible' }
          }}>
            <Box sx={{ 
              background: '#1A1A1A',
              borderRadius: { xs: '12px 12px 0 0', md: 1 },
              p: { xs: 2, md: 3 },
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
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: '#ffffff'
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
                    maxHeight: 300,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: 6,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(144, 169, 89, 0.3)',
                      borderRadius: 3,
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
                          data-testid={`filter-specialty-${specialty.replace(/\s+/g, '-')}`}
                          sx={{
                            color: '#90A959',
                            '&.Mui-checked': { color: '#90A959' }
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#ffffff' }}>
                          {specialty}
                        </Typography>
                      }
                      sx={{ 
                        display: 'block',
                        mb: 1
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
            </Box>
          </Box>

          {/* Right Side - Doctor Cards */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            mb: { xs: '80px', md: 0 } // Space for mobile filters
          }}>
            <Grid container spacing={{ xs: 1.5, md: 2 }}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Grid item xs={12} key={doctor?.id}>
                    <Box sx={{ 
                      p: { xs: 2, md: 3 },
                      background: '#1A1A1A',
                      borderRadius: 1
                    }}>
                      <Grid container spacing={{ xs: 1.5, md: 2 }}>
                        <Grid item xs={12} sm={8}>
                          <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 } }}>
                            <Avatar
                              src={doctor?.photo}
                              sx={{ 
                                width: { xs: 64, md: 80 },
                                height: { xs: 64, md: 80 },
                                bgcolor: '#90A959'
                              }}
                            >
                              {doctor?.name?.[0]}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                data-testid="doctor-name"
                                sx={{ 
                                  fontWeight: 600,
                                  color: '#ffffff',
                                  mb: 0.5,
                                  fontSize: { xs: '1.1rem', md: '1.25rem' }
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
                              <Typography 
                                variant="body2"
                                data-testid="doctor-experience"
                                sx={{ 
                                  color: '#ffffff',
                                  mt: 1,
                                  fontSize: { xs: '0.8rem', md: '0.875rem' }
                                }}
                              >
                                {doctor?.experience} yrs exp
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ 
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'column' },
                            justifyContent: { xs: 'space-between', sm: 'flex-start' },
                            alignItems: { xs: 'center', sm: 'flex-end' },
                            height: '100%',
                            gap: { xs: 1, sm: 0 }
                          }}>
                            <Typography 
                              variant="h6"
                              data-testid="doctor-fee"
                              sx={{ 
                                fontWeight: 600,
                                color: '#ffffff',
                                mb: { xs: 0, sm: 2 },
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                              }}
                            >
                              ₹{doctor?.fees}
                            </Typography>
                            <Button
                              variant="contained"
                              sx={{ 
                                mt: { xs: 0, sm: 'auto' },
                                textTransform: 'none',
                                borderRadius: 1,
                                px: 3,
                                backgroundColor: '#90A959',
                                '&:hover': {
                                  backgroundColor: '#7A914C'
                                },
                                fontSize: { xs: '0.9rem', md: '1rem' }
                              }}
                            >
                              Book Appointment
                            </Button>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: { xs: 0.5, md: 1 }
                          }}>
                            <LocationOnIcon 
                              sx={{ 
                                color: '#90A959',
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                              }} 
                            />
                            <Typography 
                              variant="body2" 
                              color="rgba(255, 255, 255, 0.7)"
                              sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
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
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    background: '#1A1A1A',
                    borderRadius: 1
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
                  </Box>
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