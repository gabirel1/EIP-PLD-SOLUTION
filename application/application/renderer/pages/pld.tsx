import { Flex, Stack, Avatar, Heading, Box, FormControl, Input, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PLD() {
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const url = localStorage.getItem('apiUrl');
    if (url === null) {
      window.location.href = '/';
      return;
    }
    setApiUrl(url);
  })



  return (
    <>
      <h1>
        PLD
      </h1>
    </>
  );
};