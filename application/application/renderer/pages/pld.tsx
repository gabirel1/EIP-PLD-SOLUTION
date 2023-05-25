import { Flex, Stack, Avatar, Text, chakra, Heading, Box, FormControl, Input, Button, InputGroup, InputLeftElement, InputRightElement, FormHelperText, FormErrorMessage, Image, useDisclosure, SimpleGrid, Center, Select, Divider, Badge } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { showNotification } from '../utils';
import axios from 'axios';
import { NavItem } from '../components/NavItem';
import { CreateCardDrawer } from '../components/CreateCardDrawer';
import {
  BiDownload,
  BiUser,
  BiPowerOff,
  BiGroup,
  BiRefresh,
  BiAddToQueue,
  BiTrash,
  BiReset,
  BiEdit
} from 'react-icons/bi'
import { NavGroup } from '../components/NavGroup';
import { CreateCategoryDrawer } from '../components/CreateCategoryDrawer';
import { ExportPDFDrawer } from '../components/ExportPdfDrawer';
import Router from 'next/router';
import { UpdateCardDrawer } from '../components/UpdateCardDrawer';

export default function PLD() {
  const [apiUrl, setApiUrl] = useState('');
  const [isError, setIsError] = useState(false);

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [totalTimePerUser, setTotalTimePerUser] = useState([]);
  const [selectedCardInformations, setSelectedCardInformations] = useState<any>();
  const [totalDoneTimePerUser, setTotalDoneTimePerUser] = useState([]);
  const [userToDisplayUuid, setUserToDisplayUuid] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2
  } = useDisclosure();

  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3
  } = useDisclosure();

  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4
  } = useDisclosure();

  useEffect(() => {
    const url = localStorage.getItem('apiUrl');
    if (url === null) {
      showNotification('Please enter the API URL first !');
      // window.location.href = '/home';
      Router.push('/home');
      return;
    }
    console.log('url == ', url);
    setApiUrl(url);
    const _username = localStorage.getItem('username');
    if (_username) setUsername(_username);
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      showNotification('Please login first !');
      // window.location.href = '/login';
      Router.push('/login');
      return;
    }
    console.log('apiUrl == ', apiUrl);
    axios({
      method: 'GET',
      url: `${apiUrl}/general-informations`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      setUsers(data.generalInformations?.users);
      setCategories(data.generalInformations?.categories);
      setTotalWorkingDays(data.generalInformations?.totalNumberOfTime);
      setTotalTimePerUser(data.generalInformations?.totalTimePerUser.sort((a, b) => {
        return b.time - a.time;
      }));
      setTotalDoneTimePerUser(data.generalInformations?.totalTimeDonePerUser.sort((a, b) => {
        return b.time - a.time;
      }));

      // console.log('users == ', users);
      // console.log('categories == ', categories);
      // console.log('totalWorkingDays == ', totalWorkingDays);
      // console.log('totalTimePerUser == ', totalTimePerUser);
    }).catch((error) => {
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
    });
  }, [apiUrl])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      showNotification('Please login first !');
      // window.location.href = '/login';
      Router.push('/login');
      return;
    }
    console.log('apiUrl == ', apiUrl);
    axios({
      method: 'GET',
      url: `${apiUrl}/card`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      // console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      setCards(data.cards);
    }).catch((error) => {
      // check if status is 401
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
    });
  }, [apiUrl])

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // window.location.href = '/login';
    Router.push('/login');
  }

  const handleRefresh = () => {
    const token = localStorage.getItem('token');
    if (token === null) {
      showNotification('Please login first !');
      // window.location.href = '/login';
      Router.push('/login');
      return;
    }
    console.log('apiUrl == ', apiUrl);
    axios({
      method: 'GET',
      url: `${apiUrl}/general-informations`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      setUsers(data.generalInformations?.users);
      setCategories(data.generalInformations?.categories);
      setTotalWorkingDays(data.generalInformations?.totalNumberOfTime);
      setTotalTimePerUser(data.generalInformations?.totalTimePerUser.sort((a, b) => {
        return b.time - a.time;
      }));
      setTotalDoneTimePerUser(data.generalInformations?.totalTimeDonePerUser.sort((a, b) => {
        return b.time - a.time;
      }));

      // console.log('users == ', users);
      // console.log('categories == ', categories);
      // console.log('totalWorkingDays == ', totalWorkingDays);
      // console.log('totalTimePerUser == ', totalTimePerUser);
    }).catch((error) => {
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
    });
    axios({
      method: 'GET',
      url: `${apiUrl}/card`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      // console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      setCards(data.cards);
    }).catch((error) => {
      // check if status is 401
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
    });
    setUserToDisplayUuid('');
  }

  const handleCardRemoval = (cardId: string) => {
    const token = localStorage.getItem('token');
    if (token === null) {
      showNotification('Please login first !');
      // window.location.href = '/login';
      Router.push('/login');
      return;
    }
    console.log('apiUrl == ', apiUrl);
    axios({
      method: 'DELETE',
      url: `${apiUrl}/card`,
      data: {
        'cardUuid': cardId
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then((response) => {
      console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      showNotification('Card removed successfully !');
      handleRefresh();
    }).catch((error) => {
      // check if status is 401
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
      return;
    });
    setIsError(false);
  }

  const handleCardUserChange = (event: any, cardId: string, userUuid: string) => {
    event.preventDefault();
    console.log('cardId == ', cardId);
    console.log('userUuid == ', userUuid);

    const token = localStorage.getItem('token');
    if (token === null) {
      showNotification('Please login first !');
      // window.location.href = '/login';
      Router.push('/login');
      return;
    }
    console.log('apiUrl == ', apiUrl);
    axios({
      method: 'POST',
      url: `${apiUrl}/card/assign`,
      data: {
        'cardUuid': cardId,
        'userUuid': userUuid
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then((response) => {
      // console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      showNotification('Card assigned successfully !');
      handleRefresh();
    }).catch((error) => {
      // check if status is 401
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
      return;
    });
  }

  const handleCardStatusChange = (event: any, cardId: string, status: string) => {
    event.preventDefault();
    console.log('cardId == ', cardId);
    console.log('status == ', status);

    const token = localStorage.getItem('token');
    if (token === null) {
      showNotification('Please login first !');
      // window.location.href = '/login';
      Router.push('/login');
      return;
    }
    console.log('apiUrl == ', apiUrl);
    axios({
      method: 'POST',
      url: `${apiUrl}/card/status`,
      data: {
        'cardUuid': cardId,
        'status': status
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then((response) => {
      // console.log('repsonse ==: ', response.data);
      const data = response.data;
      if (data.error === true || response.status === 400) {
        setIsError(true);
        return;
      }
      showNotification('Card status changed successfully !');
      handleRefresh();
    }).catch((error) => {
      // check if status is 401
      if (error.response.status === 401) {
        showNotification('Please login first !');
        // window.location.href = '/login';
        Router.push('/login');
        return;
      }
      console.log('error == ', error);
      setIsError(true);
      return;
    });
  }

  useEffect(() => {
    // console.log('selectedCardInformations1 == ', selectedCardInformations);
    if (selectedCardInformations === undefined || selectedCardInformations === null) return;
    onOpen4();
  }, [selectedCardInformations]);

  useEffect(() => {
    console.log('[useEffect] cards == ', cards);
  }, [cards])

  const handleCardUpdate = async (card: any) => {
    console.log('card == ', card);
    setSelectedCardInformations(card);
  }

  const handleAppReset = () => {
    localStorage.clear();
    showNotification('App reset successfully !');
    Router.push('/home');
  }

  const handleFilterChangeUser = (userUuid: string) => {
    console.log('userUuid == ', userUuid);
    let _cards = [...cards];
    _cards = _cards.filter((_card) => {
      return _card.card_assigned_user_uuid === userUuid;
    });
    setUserToDisplayUuid(userUuid);
    // setCards(_cards);
  }

  const handleFilterOrderBy = (orderBy: string) => {
    console.log('orderBy == ', orderBy);
    // 0 = User
    // 1 = Category
    // 2 = Status
    let _cards = [...cards];
    if (orderBy == "0") {
      // the user is determined by the uuid, we just want the cards with the same uuid to be grouped together
      console.log('_cards == ', _cards)
      _cards.sort((a, b) => {
        return (('' + a.card_assigned_user_uuid).localeCompare('' + b.card_assigned_user_uuid));
      });
      setCards(_cards);
      // refresh the view to see the changes

    }
    else if (orderBy == "1") {
      _cards.sort((a, b) => {
        return (a.category_name - b.category_name);
      });
      setCards(_cards);
    }
    else if (orderBy == "2") {
      // Status = 0 ==> Not started
      // Status = 1 ==> In progress
      // Status = 2 ==> Finished
      _cards = _cards.sort((a, b) => {
        return (a.card_status - b.card_status);
      });
      setCards(_cards);
    }
    console.log('cards == ', cards);
  }

  const showOnlyUnassignedCards = () => {
    // let _cards = [...cards];
    // _cards = _cards.filter((_card) => {
    //   return _card.card_assigned_user_uuid === null;
    // });
    // setCards(_cards);
    if (userToDisplayUuid === null) setUserToDisplayUuid('');
    else setUserToDisplayUuid(null);
  }

  return (
    <>
      <Box height="100vh" overflow="hidden" position="relative">
        <Flex h="full" id="app-container" overflow="hidden">
          <Box w="25%" bg="gray.900" color="white" fontSize="sm" overflow="hidden">
            <Flex h="full" direction="column" px="4" py="4" overflow="hidden">
              <Stack spacing="8" flex="1" overflow="auto" pt="8">
                <Stack spacing="1">
                  <NavItem active icon={<BiUser />} label={username} />
                  <NavItem icon={<BiAddToQueue />} label="Add new card" callback={() => onOpen()} />
                  <NavItem icon={<BiAddToQueue />} label="Add new category" callback={() => onOpen2()} />
                  <NavItem icon={<BiDownload />} label="Export in pdf" callback={() => onOpen3()} />
                  <NavItem icon={<BiRefresh />} label="Refresh" callback={() => handleRefresh()} />
                  <NavItem icon={<BiPowerOff />} label="Disconnect" callback={() => handleLogout()} />
                  <NavItem icon={<BiReset />} label="Reset App" callback={() => handleAppReset()} />
                </Stack>
                <NavGroup label='Estimated time per user'>
                  <NavItem icon={<BiGroup />} label={'Total: ' + totalWorkingDays} />
                  {totalTimePerUser?.map((_user, index) => {
                    return (
                      <NavItem
                        key={index}
                        icon={<BiUser />}
                        active={_user.time > 0 ? true : false}
                        label={_user.user.username + ': ' + (_user.time ? _user.time : 0)}
                      />
                    )
                  })}
                </NavGroup>
                <NavGroup label='Time done by user'>
                  {totalDoneTimePerUser?.map((_user, index) => {
                    return (
                      <NavItem
                        key={index}
                        icon={<BiUser />}
                        active={_user.time > 0 ? true : false}
                        label={_user.user.username + ': ' + (_user.time ? _user.time : 0)}
                      />
                    )
                  })}
                </NavGroup>
              </Stack>
            </Flex>
          </Box>
          <Box w="75%" bg="gray.100" overflow="hidden">
            <Flex h="full" direction="column" px="4" py="4" overflow="hidden">
              <Stack spacing="8" flex="1" overflow="auto" pt="8">
                <Stack spacing="1">
                  <Stack direction='row' spacing={"7%"} paddingBottom={"1%"}>
                    <Heading size="lg">Cards</Heading>
                    {/* Add a filter by */}
                    <Stack direction='column' spacing={5}>
                      <Text>
                        Order by:
                      </Text>
                      <Select
                        placeholder=" "
                        onChange={(e) => handleFilterOrderBy(e.target.value)}
                      >
                        <option key={0} value={0}>User</option>
                        <option key={1} value={1}>Category</option>
                        <option key={2} value={2}>Status</option>
                      </Select>
                    </Stack>
                    <Stack direction='column' spacing={5}>
                      <Text>
                        Show only cards assigned to:
                      </Text>
                      <Select
                        placeholder="Select user"
                        onChange={(e) => handleFilterChangeUser(e.target.value)}
                      >
                        {users?.map((_user, index) => {
                          return (
                            <option key={index} value={_user.uuid}>{_user.username}</option>
                          );
                        })}
                      </Select>
                    </Stack>
                    <Button
                      onClick={() => showOnlyUnassignedCards()}
                    >
                      {userToDisplayUuid != null ? "Show only unassigned cards" : "Show all cards"}
                    </Button>
                  </Stack>
                  <SimpleGrid columns={3} spacing={10}>
                    {cards?.map((card, index) => {
                      if (userToDisplayUuid == null && card.card_assigned_user_uuid != null) {
                        return null;
                      }
                      else if (userToDisplayUuid != '' && userToDisplayUuid != null && card.card_assigned_user_uuid != userToDisplayUuid) {
                        return null;
                      }
                      return (
                        <Box key={index} p="6" bg="white" borderWidth='1px' shadow="md" rounded="md">
                          <Center>
                            <Heading size="md">{card.category_name}</Heading>
                          </Center>
                          {/*
                            if card.card_assigned_user_uuid is null, then display a red headband in the top right corner with "Unassigned" written inside
                          */}
                          <Center>
                            {card.card_assigned_user_uuid == null ?
                              <Badge borderRadius="full" px="2" colorScheme="red">
                                Unassigned
                              </Badge>
                              :
                              <Badge borderRadius="full" px="2" colorScheme="green">
                                {users.find(_user => _user.uuid === card.card_assigned_user_uuid).username}
                              </Badge>
                            }
                          </Center>
                          <Divider orientation="horizontal" paddingTop='5%' />
                          <Text mt="4" fontSize="sm" fontWeight='semibold' color="gray.900">
                            {card.card_name}
                          </Text>
                          <Flex direction='row'>
                            <Text mt="4" textDecorationLine={'underline'} fontSize="sm" color="gray.900">
                              As a:
                            </Text>
                            <Text mt="4" fontSize="sm" color="gray.600" paddingLeft={'3%'}>
                              {card.card_as_a}
                            </Text>
                          </Flex>
                          <Text mt="4" fontSize="sm" textDecorationLine={'underline'} color="gray.900">
                            I want to:
                          </Text>
                          <Text mt="4" fontSize="sm" color="gray.600">
                            {card.card_i_want_to}
                          </Text>
                          <Text mt="4" textDecorationLine={'underline'} fontSize="sm" color="gray.900">
                            Description:
                          </Text>
                          <Text mt="4" fontSize="sm" color="gray.500">
                            {card.card_description}
                          </Text>
                          <Text mt="4" textDecorationLine={'underline'} fontSize="sm" color="gray.900">
                            Definition of done:
                          </Text>
                          <Text mt="4" fontSize="sm" color="gray.500">
                            {card.card_definition_of_done}
                          </Text>
                          <Flex direction='row'>
                            <Text mt="4" textDecorationLine={'underline'} fontSize="sm" color="gray.900">
                              Estimated time:
                            </Text>
                            <Text mt="4" fontSize="sm" color="gray.500" fontWeight={600} paddingLeft={'3%'}>
                              {card.card_estimated_time} days
                            </Text>
                          </Flex>
                          <div style={{ alignSelf: 'flex-end' }}>
                            <Text mt="4" fontSize="sm" textDecorationLine={'underline'} color="gray.900">
                              Assigned user:
                            </Text>
                            <FormControl paddingTop={'3%'}>
                              <Select
                                // defaultValue={card.card_assigned_user_uuid}
                                value={card.card_assigned_user_uuid}
                                placeholder={card.card_assigned_user_uuid === null ? 'Select user' : ''}
                                onChange={(e) => handleCardUserChange(e, card.uuid, e.target.value)}
                              >
                                {users?.map((_user, index) => {
                                  return (
                                    <option key={index} value={_user.uuid}>{_user.username}</option>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <Flex justify="flex-start" style={{ paddingTop: '10px' }}>
                              <Text>Status: </Text>
                              <FormControl paddingLeft={'20%'} size={'4%'} paddingTop={'3%'}>
                                <Select
                                  value={card.card_status}
                                  // placeholder="Select status"
                                  onChange={(e) => handleCardStatusChange(e, card.uuid, e.target.value)}
                                >
                                  <option key={0} value={0}>Not started</option>
                                  <option key={1} value={1}>In progress</option>
                                  <option key={2} value={2}>Finished</option>
                                </Select>
                              </FormControl>
                            </Flex>
                            <Flex justify="flex-end" style={{ paddingTop: '10px' }}>
                              <BiTrash style={{ marginRight: '10%' }} cursor={'pointer'} size='8%' color='red' onClick={() => handleCardRemoval(card.uuid)} />
                              <BiEdit cursor={'pointer'} color='blue' size='8%' onClick={() => handleCardUpdate(card)} />
                            </Flex>
                          </div>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Stack>
              </Stack>
            </Flex>
            <CreateCardDrawer
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
              availableCategories={categories}
              availableUsers={users}
              refreshFunction={handleRefresh}
            />
            <CreateCategoryDrawer
              isOpen={isOpen2}
              onClose={onClose2}
              onOpen={onOpen2}
              refreshFunction={handleRefresh}
            />
            <ExportPDFDrawer
              isOpen={isOpen3}
              onClose={onClose3}
              onOpen={onOpen3}
            />
            <UpdateCardDrawer
              isOpen={isOpen4}
              onClose={onClose4}
              onOpen={onOpen4}
              availableCategories={categories}
              availableUsers={users}
              cardInformations={selectedCardInformations}
              refreshFunction={handleRefresh}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
};