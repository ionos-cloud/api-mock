import functionService from '../services/function.service'
import {RandomStrFunc} from './random-str.func'
import {RandomIntFunc} from './random-int.func'
import {RandomEmailFunc} from './random-email.func'
import {UuidFunc} from './uuid.func'

functionService.register(new RandomStrFunc())
functionService.register(new RandomIntFunc())
functionService.register(new RandomEmailFunc())
functionService.register(new UuidFunc())
