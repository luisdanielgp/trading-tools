import { Heading, 
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Button,
  Flex, 
  Spacer,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import styles from '../styles/Calculator.module.css'
import { calculatePosition } from '../src/positionSizeCalculator'
import { useEffect, useState } from 'react'

const Calculator = () => {
  const [accountBalance, setAccountBalance] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [risk, setRisk] = useState('');
  const [positionSize, setPositionSize] = useState();
  const { colorMode, toggleColorMode } = useColorMode()

  
  const clearInputs = () => {
    setAccountBalance('')
    setEntryPrice('')
    setStopLoss('')
    setRisk('')
    setPositionSize('')
  }
  
  useEffect(() => {
    window.addEventListener("beforeunload", clearInputs);
  }, []);

  const positionSizeIsPopulated = () => {
    return typeof positionSize === 'object' && positionSize !== undefined
  }
  
  const validFields = () => {
    if (
      accountBalance !== undefined && accountBalance !== '' &&
      entryPrice !== undefined && entryPrice !== '' &&
      stopLoss !== undefined && stopLoss !== '' &&
      risk !== undefined && risk !== ''
      ) {
        return true
      }
      return false
    }
    
  const handleSubmit = () => {
    event.preventDefault();
    const positionSize = calculatePosition(parseFloat(accountBalance), parseFloat(entryPrice), parseFloat(stopLoss), parseFloat(risk))
    setPositionSize(positionSize)
  }
  return (
    <div className={styles.container}>
      <Box p='3' align="right">
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon w={4} h={4}/> : <SunIcon w={4} h={4}/>}
        </Button>
      </Box>
      <Heading as='h2' size='xl' m='12' align="center">
        Isolated Leverage Position Size Calculator
      </Heading>
      <Flex justify="space-around" wrap="wrap" >
        <Box maxW='md' borderWidth='1px' borderRadius='lg' overflow='hidden' alignItems='center' p='4' mt='6' mb='6'>
          <Flex direction="column">
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Account Balance</FormLabel>
                <Input id='accountBalance' type='text' value={accountBalance} onChange={(e) => setAccountBalance(e.target.value)}/>
              </FormControl>
              <FormControl isRequired mt='4'>
                <FormLabel>Entry Price</FormLabel>
                <Input id='entryPrice' type='text' value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
              </FormControl>
              <FormControl isRequired mt='4'>
                <FormLabel>Stop Loss</FormLabel>
                <Input id='stopLoss' type='text' value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
              </FormControl>
              <FormControl isRequired mt='4'>
                <FormLabel>Risk</FormLabel>
                <Input id='risk' type='text' value={risk} onChange={(e) => setRisk(e.target.value)} />
                <FormHelperText>
                  The account balance percentage you are willing to risk
                  in this position. Expressed as a decimal.
                </FormHelperText>
              </FormControl>
              <Button colorScheme='blue' mt='6' isDisabled={!validFields()} type="submit" width="full">Calculate</Button>
            </form> 
          </Flex>
        </Box>
        { positionSizeIsPopulated() ? (
          <Box alignItems='center' p='4'>
            <Table variant='simple'>
              <TableCaption placement="top">Position Data</TableCaption>
              <Thead>
                <Tr>
                  <Th>Concept</Th>
                  <Th>Value</Th>
                  <Th>%</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Position type</Td>
                  <Td>{positionSize.positionType}</Td>
                  <Td>-</Td>
                </Tr>
                <Tr>
                  <Td>Position size</Td>
                  <Td>{positionSize.positionSize.amount}</Td>
                  <Td>-</Td>
                </Tr>
                <Tr>
                  <Td>Leverage</Td>
                  <Td>{positionSize.positionSize.leverage}</Td>
                  <Td>-</Td>
                </Tr>
                <Tr>
                  <Td>Potential Loss</Td>
                  <Td>{positionSize.potentialLoss.amount}</Td>
                  <Td>{positionSize.potentialLoss.percentage}</Td>
                </Tr>
                <Tr>
                  <Td>Price goal 1</Td>
                  <Td>{positionSize.priceGoal1}</Td>
                  <Td>-</Td>
                </Tr>
                <Tr>
                  <Td>Price goal 2</Td>
                  <Td>{positionSize.priceGoal2}</Td>
                  <Td>-</Td>
                </Tr>
                <Tr>
                  <Td>Potential Position ROE</Td>
                  <Td>{positionSize.potentialPositionRoe.amount}</Td>
                  <Td>{positionSize.potentialPositionRoe.percentage}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        ) : null
          
      }
      </Flex>
    </div>
  )
}

export default Calculator;