# Quick Start
### 1. Prerequisites
Node.js >= 18.0.0
DFX >= 0.10.0
### 2. Install Mops CLI
Install from on-chain storage

``` curl -fsSL cli.mops.one/install.sh | sh ```

or install from npm registry

```npm i -g ic-mops ```

### 3. Initialize
Run this command in the root directory of your project (where is dfx.json placed)

```mops init ``` 

### 4. Configure dfx.json
Add mops as a packtool to your dfx.json

```{
  "defaults": {
    "build": {
      "packtool": "mops sources"
    }
  }
} 
```

### 5. Install Motoko Packages
Use mops add to install a specific package and save it to mops.toml

```mops add random ```

### 6. Import Package
Now you can import installed packages in your Motoko code

```import Rand "mo:/Rand";```