import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Stack, Textarea } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { showNotification } from "../utils";

interface CategoryDrawerProps {
  isOpen: boolean
  onClose: any
  onOpen: any
  refreshFunction: any
};

export const CreateCategoryDrawer = (props: CategoryDrawerProps) => {
  const { isOpen, onClose, onOpen, refreshFunction } = props;
  const firstField = React.useRef()

  const [categoryName, setCategoryName] = React.useState('')

  const [isError, setIsError] = React.useState(false)

  const handleCategoryCreated = () => {
    setCategoryName('')
    setIsError(false)
    onClose()
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    console.log('categoryName == ', categoryName)

    const data = {
      'categoryName': categoryName
    }
    console.log('data == ', data)
    if (data.categoryName === '') {
      setIsError(true);
      return;
    }
    const token = localStorage.getItem('token');
    const apiUrl = localStorage.getItem('apiUrl');
    axios({
      method: 'POST',
      url: `${apiUrl}/category`,
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
        showNotification(data.message);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
        return;
      }
      setIsError(false);
      handleCategoryCreated();
      refreshFunction();
      showNotification('Category successfully created !');
    })
    .catch((error) => {
      console.log('error == ', error);
      setIsError(true);
      showNotification((error.response?.data?.message) ? error.response.data.message: 'Something went wrong !');
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
          Create a new Category
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing='24px'>
            <Box>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel htmlFor='categoryName'>Category Name</FormLabel>
                <Input
                  placeholder='Enter Category Name'
                  ref={firstField}
                  value={categoryName}
                  onChange={(e) => { setCategoryName(e.target.value); setIsError(false); }}
                />
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