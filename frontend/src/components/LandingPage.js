import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import '../styles/LandingPage.css';

// Import images
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.webp';
import image3 from '../assets/image3.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  return (
    <Container maxWidth="lg" className="landing-container">
      <Box className="landing-title">
        <Typography variant="h2" component="h1">
          Welcome to Food Lens
        </Typography>
        <Typography variant="h5">
          Analyze, Learn, and Eat Smart with AI-Powered Food Insights
        </Typography>
      </Box>

      <Box className="features-container">
        <Box className="feature-box">
          <img
            src={image1}
            alt="Nutrition Detection"
            className="feature-image"
          />
          <Typography variant="h5">
            🧠 Smart Food Recognition
          </Typography>
          <Typography>
            Instantly detect ingredients and nutritional value using your camera or uploaded images.
          </Typography>
        </Box>
        <Box className="feature-box">
          <img
            src={image2}
            alt="Meal Insights"
            className="feature-image"
          />
          <Typography variant="h5">
            📊 Real-time Meal Analysis
          </Typography>
          <Typography>
            Get instant insights about ingredients, whether they're healthy or harmful, and assess
            the overall healthiness of the food product.
          </Typography>
        </Box>
        <Box className="feature-box">
          <img
            src={image3}
            alt="Community Sharing"
            className="feature-image"
          />
          <Typography variant="h5">
            🤝 Community & Recipes
          </Typography>
          <Typography>
            Share healthy dishes, discover recipes, and get feedback from a health-conscious community.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {isSignedIn ? (
          <Button
            variant="contained"
            size="large"
            className="get-started-button"
            onClick={() => navigate('/home')}
          >
            Go to Dashboard
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              className="get-started-button"
            >
              Get Started
            </Button>
          </SignInButton>
        )}
      </Box>
    </Container>
  );
};

export default LandingPage;
