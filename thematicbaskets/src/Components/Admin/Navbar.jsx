import React from 'react';
import { Flex, Button, Text, Image } from '@chakra-ui/react';
import Cookies from 'cookies-js';
import { useNavigate } from 'react-router-dom';
import Logo from "../../Images/logo.png"

export default function Navbar() {
  const navigate = useNavigate();
  const userName = Cookies.get('username_admin');

  const handleLogout = () => {
    Cookies.expire('username_admin');
    Cookies.expire('login_token_admin');
    navigate('/admin');

  };

  return (
    <Flex
      bg="white"
      p="4"
      color="#244c9c"
      justify="space-between"
      align="center"
      boxShadow="0 4px 6px -1px rgba(34, 85, 187, 0.1), 0 2px 4px -2px rgba(36, 76, 156, 0.1)"
      flexDirection="row"
      textAlign="left"
    >
      <Flex align="center">
        <Image
          src={Logo}
          alt="Logo"
          cursor="pointer"
          onClick={() => navigate('/admin/dashboard')}
          boxSize="50px"
          width="150px" 
          mr="4"
        />
        {userName && <Text fontSize="xl" fontWeight="bold">Welcome, {userName}</Text>}
      </Flex>
      {userName && (
        <Button
          onClick={handleLogout}
          bg="#244c9c"
          color="white"
          _hover={{ bg: '#5274ac' }}
        >
          Logout
        </Button>
      )}
    </Flex>
  );
}
