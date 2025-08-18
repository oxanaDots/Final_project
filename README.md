# React + Vite


Vite is an optimisation build tool uwhich enable fast server start by making use of ES modules. The source files are served as native ES modules, instead of using bundlers to optimise files.
Vite's Hot Module Replacement enables update of changed modules only, resulting in fast server start. 


React is a Javascript framework which, unlike Javascript, uses a decleartive syntax instead of an imperative syntax. When using Js, to arrive at the desired UI, the DOM elements need to be selected and traversed manually. React abstracts away from DOM, to arrive at the desride UI, we describe what UI should look like using jsx syntax, instead of telling the program what to do  and how to do it.

# starting the server

nmp install
npm run dev

# starting Firebase emulators

firebase init emulators
<!-- select the following emulators: Authentication emulator, Firestore emulator, Storage emulator, Functions emulator -->
firebase emulators:start

# running security test results, all cd commands must be run from the project root 

cd security_rules_test
npm test

# running cloud functions test results
 cd ..
 cd cloud_functions_test
 npm test

 # running unit tests for frontend components
cd ..
npm run test:coverage







