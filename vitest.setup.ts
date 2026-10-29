// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

import { pointToTestDatabase } from './tests/helpers/pointToTestDatabase'

pointToTestDatabase()
