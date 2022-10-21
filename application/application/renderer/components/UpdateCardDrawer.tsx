import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Stack,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { showNotification } from "../utils";

interface UpdateCardDrawerProps {
  isOpen: boolean
  onClose: any
  onOpen: any
  availableCategories: any
  availableUsers: any
  cardInformations: any
  refreshFunction: any
};

export const UpdateCardDrawer = (props: UpdateCardDrawerProps) => {
  const { isOpen, onClose, onOpen, availableCategories, availableUsers, cardInformations, refreshFunction } = props
  const firstField = React.useRef()

  const [cardUuid, setCardUuid] = React.useState(cardInformations?.uuid)
  const [categoryName, setCategoryName] = React.useState(cardInformations?.category_name || '')
  const [cardName, setCardName] = React.useState(cardInformations?.card_name || '')
  const [cardDescription, setCardDescription] = React.useState(cardInformations?.card_description || '')
  const [cardAsA, setCardAsA] = React.useState(cardInformations?.card_as_a || '')
  const [cardIWantTo, setCardIWantTo] = React.useState(cardInformations?.card_i_want_to || '')
  const [cardDefinitionOfDone, setCardDefinitionOfDone] = React.useState(cardInformations?.card_definition_of_done || '')
  const [cardEstimatedTime, setCardEstimatedTime] = React.useState(cardInformations?.card_estimated_time || '1')
  const [cardAssignedUserUuid, setCardAssignedUserUuid] = React.useState(cardInformations?.card_assigned_user_uuid || '')

  const [isError, setIsError] = React.useState(false)

  useEffect(() => {
    setCardUuid(cardInformations?.uuid)
    setCategoryName(cardInformations?.category_name || '')
    setCardName(cardInformations?.card_name || '')
    setCardDescription(cardInformations?.card_description || '')
    setCardAsA(cardInformations?.card_as_a || '')
    setCardIWantTo(cardInformations?.card_i_want_to || '')
    setCardDefinitionOfDone(cardInformations?.card_definition_of_done || '')
    setCardEstimatedTime(cardInformations?.card_estimated_time || '1')
    setCardAssignedUserUuid(cardInformations?.card_assigned_user_uuid || '')
  }, [cardInformations])

  const handleCardCreated = () => {
    setCategoryName('')
    setCardName('')
    setCardDescription('')
    setCardAsA('')
    setCardIWantTo('')
    setCardDefinitionOfDone('')
    setCardEstimatedTime('')
    setCardAssignedUserUuid('')
    setCardUuid('')
    setIsError(false)
    onClose()
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    console.log('categoryName == ', categoryName)
    console.log('cardName == ', cardName)
    console.log('cardDescription == ', cardDescription)
    console.log('cardAsA == ', cardAsA)
    console.log('cardIWantTo == ', cardIWantTo)
    console.log('cardDefinitionOfDone == ', cardDefinitionOfDone)
    console.log('cardEstimatedTime == ', cardEstimatedTime)
    console.log('cardAssignedUserUuid == ', cardAssignedUserUuid)

    const data = {
      'cardUuid': cardUuid,
      'categoryName': categoryName,
      'cardName': cardName,
      'cardDescription': cardDescription,
      'cardAsA': cardAsA,
      'cardIWantTo': cardIWantTo,
      'cardDefinitionOfDone': cardDefinitionOfDone,
      'cardEstimatedTime': cardEstimatedTime,
      'cardAssignedUserUuid': (cardAssignedUserUuid !== '') ? cardAssignedUserUuid : undefined
    }
    console.log('data == ', data)
    if (data.categoryName === '' || data.cardName === ''
      || data.cardDescription === '' || data.cardAsA === ''
      || data.cardIWantTo === '' || data.cardDefinitionOfDone === ''
      || data.cardEstimatedTime === '') {
      setIsError(true);
      return;
    }
    const token = localStorage.getItem('token');
    const apiUrl = localStorage.getItem('apiUrl');
    axios({
      method: 'PUT',
      url: `${apiUrl}/card`,
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        const data = response.data;
        console.log('data == ', data);
        if (data.error === true || response.status === 400) {
          setIsError(true);
          showNotification('Could not update card');
          setTimeout(() => {
            setIsError(false);
          }, 3000);
          return;
        }
        setIsError(false);
        handleCardCreated();
        refreshFunction();
        showNotification('Card updated successfully !');
      })
      .catch((error) => {
        console.log('error == ', error);
        setIsError(true);
        showNotification('Could not update card');
      });
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      initialFocusRef={firstField}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>
          Update Card {cardUuid}
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing='24px'>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='categoryName'>Category Name</FormLabel>
                <Select
                  placeholder='Select Category'
                  ref={firstField}
                  value={categoryName}
                  onChange={(e) => { setCategoryName(e.target.value); setIsError(false); }}
                >
                  {availableCategories?.map((category: any) => (
                    <option key={category.uuid} value={category.category_name}>{category.category_name}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='username'>Card Name</FormLabel>
                <Input
                  // ref={firstField}
                  id='cardName'
                  value={cardName}
                  onChange={(e) => { setCardName(e.target.value); setIsError(false); }}
                  isRequired
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='cardDescription'>Card Description</FormLabel>
                <Textarea
                  // ref={firstField}
                  id='cardDescription'
                  value={cardDescription}
                  onChange={(e) => { setCardDescription(e.target.value); setIsError(false); }}
                  isRequired
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='cardAsA'>As A</FormLabel>
                <Input
                  // ref={firstField}
                  id='cardAsA'
                  value={cardAsA}
                  onChange={(e) => { setCardAsA(e.target.value); setIsError(false); }}
                  isRequired
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='cardIWantTo'>I Want To</FormLabel>
                <Input
                  // ref={firstField}
                  id='cardIWantTo'
                  value={cardIWantTo}
                  onChange={(e) => { setCardIWantTo(e.target.value); setIsError(false); }}
                  isRequired
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='cardDefinitionOfDone'>Definition Of Done</FormLabel>
                <Textarea
                  // ref={firstField}
                  id='cardDefinitionOfDone'
                  value={cardDefinitionOfDone}
                  onChange={(e) => { setCardDefinitionOfDone(e.target.value); setIsError(false); }}
                  isRequired
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='cardEstimatedTime'>Estimated Time</FormLabel>
                <InputGroup>
                  <NumberInput
                    size='md'
                    maxW={32}
                    defaultValue={1}
                    min={0}
                    value={cardEstimatedTime}
                    onChange={(value) => { setCardEstimatedTime(value); setIsError(false); }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <InputRightAddon children='Days' />
                </InputGroup>
              </FormControl>
            </Box>
            <Box>
              <FormControl isInvalid={isError}>
                <FormLabel htmlFor='owner'>Assignated User</FormLabel>
                <Select
                  placeholder='Select User'
                  // ref={firstField}
                  value={cardAssignedUserUuid}
                  onChange={(e) => { setCardAssignedUserUuid(e.target.value); setIsError(false); }}
                >
                  {availableUsers?.map((user: any) => (
                    <option key={user.uuid} value={user.uuid}>{user.username}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth='1px'>
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme='teal'
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer >
  );
}