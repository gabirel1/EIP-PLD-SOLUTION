import { Box,
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
  Select,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/react";
import axios from "axios";
import { writeFile } from 'fs/promises';
import moment from "moment";
import React, { useEffect } from "react";
import { showNotification } from "../utils";

interface CategoryDrawerProps {
  isOpen: boolean
  onClose: any
  onOpen: any
}

export const ExportPDFDrawer = (props: CategoryDrawerProps) => {
  const { isOpen, onClose, onOpen } = props;
  const firstField = React.useRef();

  const [projectName, setProjectName] = React.useState('');
  const [sprintNumber, setSprintNumber] = React.useState(0);
  const [sprintPhase, setSprintPhase] = React.useState('');

  const sprintPhases = [
    'Kickoff',
    'Follow-up',
    'Delivery'
  ];

  const [isError, setIsError] = React.useState(false);

  const getProjectPhase = (phase) => {
    switch (phase) {
      case 'Kickoff':
        return 'KO';
      case 'Follow-up':
        return 'FU';
      case 'Delivery':
        return 'D';
      default:
        return 'KO';
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const apiUrl = localStorage.getItem('apiUrl');

    if (apiUrl === null || token === null) {
      setIsError(true);
      showNotification('No API URL or token found, please login again');
      return;
    }

    if (projectName === '' || sprintNumber === 0 || sprintPhase === '') {
      setIsError(true);
      showNotification('Please fill all fields');
      return;
    }

    const data = {
      'projectName': projectName,
      'sprintNumber': sprintNumber,
      'sprintPhase': sprintPhase
    };

    axios({
      method: 'POST',
      url: `${apiUrl}/export`,
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'stream'
    })
    .then(async (response) => {
      const data = response.data;
      if (response.status !== 200) {
        setIsError(true);
        showNotification('Error while exporting PDF');
        setTimeout(() => {
          setIsError(false);
        }, 3000);
        return;
      }
      // 2024_PLD_BLOCK2SCHOOL_202207KO_2.pdf
      const filename = `${moment().format('YYYY')}_PLD_${projectName?.toUpperCase()}_${moment().format('YYYYMM')}${getProjectPhase(sprintPhase)}_${sprintNumber}.pdf`;
      await writeFile(filename, data);
      setIsError(false);
      showNotification('Successfully exported PDF');
    })
    .catch((error) => {
      console.log('error == ', error);
      setIsError(true);
      showNotification('Something went wrong');
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    });
    onClose();
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={firstField}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Export PDF
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormControl isRequired isInvalid={isError}>
                  <FormLabel>Project Name</FormLabel>
                  <Input
                    ref={firstField}
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired isInvalid={isError}>
                  <FormLabel>Sprint Number</FormLabel>
                  <NumberInput
                    size='md'
                    maxW={32}
                    defaultValue={1}
                    min={0}
                    onChange={(useless, value) => setSprintNumber(value)}
                    value={sprintNumber}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired isInvalid={isError}>
                  <FormLabel>Sprint Phase</FormLabel>
                  <Select
                    placeholder="Select option"
                    value={sprintPhase}
                    onChange={(event) => setSprintPhase(event.target.value)}
                  >
                    {sprintPhases.map((phase) => (
                      <option key={phase} value={phase}>
                        {phase}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Export
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}