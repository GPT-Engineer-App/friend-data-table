import React, { useState, useEffect } from 'react';
import { Container, Table, Thead, Tbody, Tr, Th, Td, Input, Button, VStack } from "@chakra-ui/react";
import { FaEnvelope } from 'react-icons/fa';

const Index = () => {
  const [rows, setRows] = useState([createEmptyRow()]);
  const [data, setData] = useState(loadDataFromCookies());

  useEffect(() => {
    saveDataToCookies(data);
  }, [data]);

  function createEmptyRow() {
    return {
      name: '',
      sex: '',
      phone: '',
      street: '',
      city: '',
      country: '',
      zip: '',
      email: '',
      years: ''
    };
  }

  function loadDataFromCookies() {
    const cookies = document.cookie.split('; ');
    const dataCookie = cookies.find(cookie => cookie.startsWith('friendsData='));
    return dataCookie ? JSON.parse(decodeURIComponent(dataCookie.split('=')[1])) : [createEmptyRow()];
  }

  function saveDataToCookies(data) {
    document.cookie = `friendsData=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=31536000`;
  }

  function handleInputChange(e, rowIndex, field) {
    const newData = [...data];
    newData[rowIndex][field] = e.target.value;
    setData(newData);
  }

  function addRow() {
    setRows([...rows, createEmptyRow()]);
    setData([...data, createEmptyRow()]);
  }

  function sendReport() {
    const email = "ohad_gross@hotmail.com";
    const subject = `Names Report - ${new Date().toLocaleString()}`;
    const body = data.map(row => Object.values(row).join(', ')).join('\n');
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th textAlign="center">Friend's Name</Th>
              <Th textAlign="center">Sex</Th>
              <Th textAlign="center">Phone Number</Th>
              <Th textAlign="center">Street Name</Th>
              <Th textAlign="center">City</Th>
              <Th textAlign="center">Country</Th>
              <Th textAlign="center">Zip Code</Th>
              <Th textAlign="center">Email</Th>
              <Th textAlign="center">Years of Friendship</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {Object.keys(row).map((field, fieldIndex) => (
                  <Td key={fieldIndex}>
                    <Input
                      size="sm"
                      value={data[rowIndex][field]}
                      onChange={(e) => handleInputChange(e, rowIndex, field)}
                      maxLength={15}
                    />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button onClick={addRow}>Add Row</Button>
        <Button leftIcon={<FaEnvelope />} onClick={sendReport}>Send Report</Button>
      </VStack>
    </Container>
  );
};

export default Index;