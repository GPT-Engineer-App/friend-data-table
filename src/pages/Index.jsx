import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Thead, Tbody, Tr, Th, Td, Input, Button, VStack, Select } from "@chakra-ui/react";
import { FaEnvelope, FaCopy } from 'react-icons/fa';

const Index = () => {
  const [rows, setRows] = useState([createEmptyRow()]);
  const [data, setData] = useState(loadDataFromCookies());
  const formRef = useRef(null);

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

  const copyToClipboard = () => {
    try {
      if (formRef.current) {
        const formHTML = formRef.current.outerHTML;
        navigator.clipboard.writeText(formHTML).then(() => {
          alert('Form HTML copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    } catch (error) {
      console.error('Error copying form HTML: ', error);
    }
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <div ref={formRef}>
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
                      {field === 'sex' ? (
                        <Select
                          size="sm"
                          value={data[rowIndex][field]}
                          onChange={(e) => handleInputChange(e, rowIndex, field)}
                        >
                          <option value="">Select Sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Bi Sexual">Bi Sexual</option>
                          <option value="Homo">Homo</option>
                          <option value="Lesbian">Lesbian</option>
                          <option value="Transgender">Transgender</option>
                        </Select>
                      ) : (
                        <Input
                          size="sm"
                          value={data[rowIndex][field]}
                          onChange={(e) => handleInputChange(e, rowIndex, field)}
                          maxLength={15}
                        />
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button onClick={addRow}>Add Row</Button>
          <Button leftIcon={<FaEnvelope />} onClick={sendReport}>Send Report</Button>
        </div>
        <Button leftIcon={<FaCopy />} onClick={copyToClipboard}>Copy Form Code</Button>
      </VStack>
    </Container>
  );
};

export default Index;