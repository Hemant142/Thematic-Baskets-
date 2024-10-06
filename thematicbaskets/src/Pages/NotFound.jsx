import React from 'react';
import { Box, Heading, Icon, Text, useBreakpointValue } from '@chakra-ui/react';
import { AiOutlineFrown } from 'react-icons/ai';

export default function NotFound() {
  // Use a breakpoint value to adjust padding and font sizes responsively
  const headingSize = useBreakpointValue({ base: '4xl', md: '6xl', lg: "4xl" });
 
  const textSize = useBreakpointValue({ base: 'md', md: 'lg', lg: "xl" }); // Adjusted text size for larger screens

  return (
    <Box
      textAlign="center"
      
      py={10}
      
      px={6}
      height="100vh"
      bg={"#000000"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, #1a1a1a, #000000)" // Dark gradient background
      color="whiteAlpha.900" // Softer white for contrast
    //   borderRadius="md" // Rounded corners
      boxShadow="xl" // Shadow for depth
      p={{ base: 6, md: 8 }} // Responsive padding
      bgImage="url('https://images.unsplash.com/photo-1499880410315-52c0522a7042')" // Optional background image
      bgSize="cover" // Ensure background covers the entire box
      bgPosition="center" // Center the background image
      position="relative" // Position relative for pseudo-elements
    >
      {/* Optional Overlay to Darken Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.7)" // Darker semi-transparent overlay
        borderRadius="md" // Rounded corners for overlay
      />
      <Icon as={AiOutlineFrown} w={16} h={16} mb={4} color="white" zIndex={1} /> {/* Changed icon color to white */}
      <Heading
        as="h1"
        size={headingSize} // Responsive heading size
        mb={4}
        textTransform="uppercase" // Capital letters
        letterSpacing="widest" // Increased letter spacing
        zIndex={1} // Ensure it is above overlay
      >
        404
      </Heading>
      <Text fontSize={textSize} color="gray.300" zIndex={1}>
        Oops!!! The page you are looking for is not found.
      </Text>
    </Box>
  );
}
