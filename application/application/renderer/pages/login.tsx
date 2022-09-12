import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flex, Stack, Avatar, Text, chakra, Heading, Box, FormControl, Input, Button, InputGroup, InputLeftElement, InputRightElement, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import CryptoJS from "crypto-js";
import axios from 'axios';
import { FaUserAlt, FaLock } from "react-icons/fa";
import { showNotification } from '../utils';
import Router from 'next/router';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function Login() {
  const [apiUrl, setApiUrl] = useState('');
  const [username, setUsername] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);

  const hashPassword = (password: string): string => {
    const hashed: string = CryptoJS.SHA256(password).toString();
    return hashed;
  }

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  }

  useEffect(() => {
    const url = localStorage.getItem('apiUrl');
    if (url === null) {
      showNotification('Please enter the API URL first !');
      // window.location.href = '/home';
      Router.push('/home');
      return;
    }
    setApiUrl(url);
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const password = hashPassword(passwordInput);
    await axios({
      method: 'POST',
      url: `${apiUrl}/login`,
      data: {
        'username': username,
        'password': password
      }
    })
    .then((response) => {
      const data = response.data;
      console.log('data == ', data);
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      const token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
  
      setIsError(false);
      // window.location.href = '/pld';
      Router.push('/pld')
    })
    .catch((error) => {
      console.log('error', error);
      setIsError(true);
      return;
    });
  }

  return (
    <>
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar bg="teal.500" />
          <Heading color="teal.400">Welcome</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl isRequired isInvalid={isError}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="text"
                      placeholder="Username"
                      onChange={(event) => { setUsername(event.target.value); setIsError(false); }}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired isInvalid={isError}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={(event) => { setPasswordInput(event.target.value); setIsError(false) }}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {
                    isError === true ?
                      <FormErrorMessage>Wrong password or username.</FormErrorMessage>
                      : null
                  }
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          <Flex gap={1}>
            <Text>
              Don't have an account ?{" "}
            </Text>
            <Link color="teal.400" href="/register">
              <Text color="teal.400">
                Sign Up
              </Text>
            </Link>

          </Flex>
        </Box>
      </Flex>
    </>
  );
};