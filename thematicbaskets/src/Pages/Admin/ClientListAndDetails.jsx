import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
// import Navbar from "../Components/Navbar";
import Navbar from "../../Components/Admin/Navbar" ;
import { useDispatch, useSelector } from "react-redux";
// import { fetchClients } from "../Redux/clientReducer/action";
import Cookies from "js-cookie";
import { fetchAllClients } from "../../Redux/clientReducer/action";

export default function ClientListAndDetails() {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [clientsData, setClientsData] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  let token = Cookies.get("login_token_admin");
  let clientsData=useSelector((store)=>store.clientsReducer.clients)


console.log(token,"Token")
  useEffect(() => {
    dispatch(fetchAllClients(token))
  }, []);

  useEffect(() => {
    if (clientsData) {
      const filtered = clientsData.filter((client) =>
        client.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSelectedClient(filtered[0])

      setFilteredClients(filtered);
    }
  }, [clientsData, searchQuery]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    }
  };

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );


  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const toggleStatus=(id)=>{
    console.log(id,"Toggle Id")
  }

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Navbar />

      <Tabs variant="unstyled" mt="10px" borderBottomColor="gray.200">
        <TabList display="flex" margin={"auto"} >
          {/* <===================================== Basket List====================> */}
          <Tab
            as={Link}
            to="/admin/dashboard"
            fontWeight="bold"
            color={location.pathname === "/admin/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/dashboard" && "2px solid"}
            borderColor={location.pathname === "/admin/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Basket List
          </Tab>
          {/* <===================================== Algo List List====================> */}
          <Tab
            as={Link}
            to="/admin/algolist"
            fontWeight="bold"
            color={location.pathname === "/admin/algolist" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/algolist" && "2px solid"}
            borderColor={location.pathname === "/admin/algolist" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Algo List
          </Tab>
          {/* <===================================== Signal List====================> */}
          <Tab
            as={Link}
            to="/admin/signallist"
            fontWeight="bold"
            color={location.pathname === "/admin/signallist" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/signallist" && "2px solid"}
            borderColor={location.pathname === "/admin/signallist" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Signal List
          </Tab>

          {/* <===================================== Add RA & RA List====================> */}
          <Tab
            as={Link}
            to="/admin/addRA"
            fontWeight="bold"
            color={location.pathname === "/admin/addRA" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/addRA" && "2px solid"}
            borderColor={location.pathname === "/admin/addRA" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Add RA & RA List
          </Tab>

          {/* <=======================Client List and Dealer List=====================> */}
          <Tab
            as={Link}
            to="/admin/clientsList"
            fontWeight="bold"
            color={
              location.pathname === "/admin/clientsList" ? "#244c9c" : "gray.500"
            }
            borderBottom={location.pathname === "/admin/clientsList" && "2px solid"}
            borderColor={location.pathname === "/admin/clientsList" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Clients List & Details
          </Tab>

          {/* <======================= Add Dealer and Dealer List =====================> */}
          <Tab
            as={Link}
            to="/admin/addDealer"
            fontWeight="bold"
            color={location.pathname === "/admin/addDealer" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/admin/addDealer" && "2px solid"}
            borderColor={location.pathname === "/admin/addDealer" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Add Dealer & Dealer List
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex direction="column" bg="gray.50" p={5} shadow="md" h="100vh">
              <Flex justify="space-between" align="center" mb={5}>
                <Heading size="lg" color="blue.900">
                  Client Details
                </Heading>
              </Flex>

              <Flex gap={5} flex={1} overflow="hidden">
                {/* Left side - List of clients */}
                <Box
                  w="40%"
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  boxShadow="base"
                  overflowY="auto"
                >
                  <Heading
                    size="md"
                    mb={4}
                    color="indigo.700"
                    borderBottomWidth="2px"
                  >
                    Clients
                  </Heading>
                  {isLoading && <Text>Loading...</Text>}
                  <Flex mb={4} gap={2}>
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearch}
                    />
                    {/* <Button colorScheme="blue">Search</Button> */}
                  </Flex>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th textTransform="capitalize">Name</Th>
                        <Th textTransform="capitalize">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentClients.map((client, index) => (
                        <Tr
                          key={index}
                          onClick={() => handleClientClick(client)}
                          cursor="pointer"
                          bg={selectedClient === client ? "blue.100" : "white"}
                          _hover={{ bg: "gray.100" }}
                        >
                          <Td>{indexOfFirstItem + index + 1}</Td>
                          <Td>{client.userName}</Td>
                          <Td>
                    <Switch
                      isChecked={client.isActive}
                      onChange={() => toggleStatus(client._id)}
                     
                    />
                  </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {Math.ceil(filteredClients.length / itemsPerPage)>1?(
                     <Box
                     display="flex"
                     justifyContent="space-between"
                     alignItems="center"
                     mt={4}
                   >
                   {currentPage==1?(  <Button
                       // onClick={() => handlePageClick(currentPage - 1)}
                       disabled={currentPage == 1}
                       colorScheme={currentPage === 1 ? "gray" : "blue"}
                     >
                       Previous
                     </Button>):(  <Button
                       onClick={() => handlePageClick(currentPage - 1)}
                       disabled={currentPage == 1}
                       colorScheme={currentPage === 1 ? "gray" : "blue"}
                     >
                       Previous
                     </Button>)}
                     <Box>
                       Page {currentPage} of{" "}
                       {Math.ceil(filteredClients.length / itemsPerPage)}
                     </Box>
                     {currentPage==Math.ceil(filteredClients.length / itemsPerPage)?( <Button
                       disabled={
                         currentPage ==
                         Math.ceil(filteredClients.length / itemsPerPage)
                       }
                       colorScheme={
                         currentPage ===
                         Math.ceil(filteredClients.length / itemsPerPage)
                           ? "gray"
                           : "blue"
                       }
                     >
                       Next
                     </Button>):( <Button
                       onClick={() => handlePageClick(currentPage + 1)}
                       disabled={
                         currentPage ==
                         Math.ceil(filteredClients.length / itemsPerPage)
                       }
                       colorScheme={
                         currentPage ===
                         Math.ceil(filteredClients.length / itemsPerPage)
                           ? "gray"
                           : "blue"
                       }
                     >
                       Next
                     </Button>)}
                    
                   </Box>
                  ):""}
                   
                 
                </Box>

                {/* Right side - Client details */}
                <Box
                  w="60%"
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  boxShadow="base"
                  overflowY="auto"
                >
                  {selectedClient ? (
                    <VStack align="start" spacing={4}>
                      <Heading
                        size="md"
                        color="indigo.700"
                        borderBottomWidth="2px"
                      >
                        Client Details: {selectedClient.client_name}
                      </Heading>
                      <Table variant="simple">
                        <Tbody>
                          <Tr>
                            <Td>
                              <strong>Client Name:</strong>
                            </Td>
                            <Td>{selectedClient.userName}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <strong>Client ID:</strong>
                            </Td>
                            <Td>{selectedClient.profile.clientId}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <strong>Client Address:</strong>
                            </Td>
                            <Td>{selectedClient.address}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>Dealer Name:</strong>
                            </Td>
                            <Td>{selectedClient.address}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>What's App Consent:</strong>
                            </Td>
                            <Td>{selectedClient.consent}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>Available Balance:</strong>
                            </Td>
                            <Td>{selectedClient.availabeBalance}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>Subscribed Basket:</strong>
                            </Td>
                            <Td>{selectedClient.basketSuscribedId.length}</Td>
                          </Tr>
                          {/* Add more client details as needed */}
                          {/* <Tr>
                            <Td>
                              <strong>Client Status:</strong>
                            </Td>
                            <Td>
                              {selectedClient.client_status
                                ? "Active"
                                : "Inactive"}
                            </Td>
                          </Tr> */}
                        </Tbody>
                      </Table>

                      <Heading
                        size="sm"
                        color="indigo.700"
                        borderBottomWidth="2px"
                      >
                        Order History
                      </Heading>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>#</Th>
                            <Th textTransform="capitalize">Date</Th>
                            <Th textTransform="capitalize">Basket Name</Th>
                            <Th textTransform="capitalize">Script Name</Th>
                            <Th textTransform="capitalize">Entry Price</Th>
                            <Th textTransform="capitalize">Exit Price</Th>
                            <Th textTransform="capitalize">Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {selectedClient.order_history?.map((order, index) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td>{order.date}</Td>
                              <Td>{order.basket_name}</Td>
                              <Td>{order.script_name}</Td>
                              <Td>{order.entry_price}</Td>
                              <Td>{order.exit_price}</Td>
                              <Td>{order.status}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </VStack>
                  ) : (
                    <Text>Select a client to see the details</Text>
                  )}
                </Box>
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
          <TabPanel>
            <Flex direction="column" bg="gray.50" p={5} shadow="md" h="100vh">
              <Flex justify="space-between" align="center" mb={5}>
                <Heading size="lg" color="blue.900">
                  Client Details
                </Heading>
              </Flex>

              <Flex gap={5} flex={1} overflow="hidden">
                {/* Left side - List of clients */}
                <Box
                  w="40%"
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  boxShadow="base"
                  overflowY="auto"
                >
                  <Heading
                    size="md"
                    mb={4}
                    color="indigo.700"
                    borderBottomWidth="2px"
                  >
                    Clients
                  </Heading>
                  {isLoading && <Text>Loading...</Text>}
                  <Flex mb={4} gap={2}>
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearch}
                    />
                    {/* <Button colorScheme="blue">Search</Button> */}
                  </Flex>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>#</Th>
                        <Th textTransform="capitalize">Name</Th>
                        <Th textTransform="capitalize">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentClients.map((client, index) => (
                        <Tr
                          key={index}
                          onClick={() => handleClientClick(client)}
                          cursor="pointer"
                          bg={selectedClient === client ? "blue.100" : "white"}
                          _hover={{ bg: "gray.100" }}
                        >
                          <Td>{indexOfFirstItem + index + 1}</Td>
                          <Td>{client.userName}</Td>
                          <Td>
                    <Switch
                      isChecked={client.isActive}
                      onChange={() => toggleStatus(client._id)}
                     
                    />
                  </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {Math.ceil(filteredClients.length / itemsPerPage)>1?(
                     <Box
                     display="flex"
                     justifyContent="space-between"
                     alignItems="center"
                     mt={4}
                   >
                   {currentPage==1?(  <Button
                       // onClick={() => handlePageClick(currentPage - 1)}
                       disabled={currentPage == 1}
                       colorScheme={currentPage === 1 ? "gray" : "blue"}
                     >
                       Previous
                     </Button>):(  <Button
                       onClick={() => handlePageClick(currentPage - 1)}
                       disabled={currentPage == 1}
                       colorScheme={currentPage === 1 ? "gray" : "blue"}
                     >
                       Previous
                     </Button>)}
                     <Box>
                       Page {currentPage} of{" "}
                       {Math.ceil(filteredClients.length / itemsPerPage)}
                     </Box>
                     {currentPage==Math.ceil(filteredClients.length / itemsPerPage)?( <Button
                       disabled={
                         currentPage ==
                         Math.ceil(filteredClients.length / itemsPerPage)
                       }
                       colorScheme={
                         currentPage ===
                         Math.ceil(filteredClients.length / itemsPerPage)
                           ? "gray"
                           : "blue"
                       }
                     >
                       Next
                     </Button>):( <Button
                       onClick={() => handlePageClick(currentPage + 1)}
                       disabled={
                         currentPage ==
                         Math.ceil(filteredClients.length / itemsPerPage)
                       }
                       colorScheme={
                         currentPage ===
                         Math.ceil(filteredClients.length / itemsPerPage)
                           ? "gray"
                           : "blue"
                       }
                     >
                       Next
                     </Button>)}
                    
                   </Box>
                  ):""}
                   
                 
                </Box>

                {/* Right side - Client details */}
                <Box
                  w="60%"
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  boxShadow="base"
                  overflowY="auto"
                >
                  {selectedClient ? (
                    <VStack align="start" spacing={4}>
                      <Heading
                        size="md"
                        color="indigo.700"
                        borderBottomWidth="2px"
                      >
                        Client Details: {selectedClient.client_name}
                      </Heading>
                      <Table variant="simple">
                        <Tbody>
                          <Tr>
                            <Td>
                              <strong>Client Name:</strong>
                            </Td>
                            <Td>{selectedClient.userName}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <strong>Client ID:</strong>
                            </Td>
                            <Td>{selectedClient.profile.clientId}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <strong>Client Address:</strong>
                            </Td>
                            <Td>{selectedClient.address}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>Dealer Name:</strong>
                            </Td>
                            <Td>{selectedClient.address}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>What's App Consent:</strong>
                            </Td>
                            <Td>{selectedClient.consent}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>Available Balance:</strong>
                            </Td>
                            <Td>{selectedClient.availabeBalance}</Td>
                          </Tr>

                          <Tr>
                            <Td>
                              <strong>Subscribed Basket:</strong>
                            </Td>
                            <Td>{selectedClient.basketSuscribedId.length}</Td>
                          </Tr>
                          {/* Add more client details as needed */}
                          {/* <Tr>
                            <Td>
                              <strong>Client Status:</strong>
                            </Td>
                            <Td>
                              {selectedClient.client_status
                                ? "Active"
                                : "Inactive"}
                            </Td>
                          </Tr> */}
                        </Tbody>
                      </Table>

                      <Heading
                        size="sm"
                        color="indigo.700"
                        borderBottomWidth="2px"
                      >
                        Order History
                      </Heading>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>#</Th>
                            <Th textTransform="capitalize">Date</Th>
                            <Th textTransform="capitalize">Basket Name</Th>
                            <Th textTransform="capitalize">Script Name</Th>
                            <Th textTransform="capitalize">Entry Price</Th>
                            <Th textTransform="capitalize">Exit Price</Th>
                            <Th textTransform="capitalize">Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {selectedClient.order_history?.map((order, index) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td>{order.date}</Td>
                              <Td>{order.basket_name}</Td>
                              <Td>{order.script_name}</Td>
                              <Td>{order.entry_price}</Td>
                              <Td>{order.exit_price}</Td>
                              <Td>{order.status}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </VStack>
                  ) : (
                    <Text>Select a client to see the details</Text>
                  )}
                </Box>
              </Flex>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
