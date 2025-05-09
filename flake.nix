{
  description = "Nix flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    utils.url = "github:numtide/flake-utils";
  };
  outputs = { nixpkgs, utils, ... }: 
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        chromiumPackage = if pkgs.stdenv.isDarwin
          then [ ]
          else [ pkgs.chromium ];
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
          ] ++ chromiumPackage;

          shellHook =  if !pkgs.stdenv.isDarwin
            then ''
            echo "This is a Linux system"
            echo "Node.js version:"
            echo "$(${pkgs.nodejs}/bin/node -v)"

            # Set Puppeteer to not download Chrome, cause it doesn't work on NixOS
            export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
            # Set Puppeteer to use Chromium from Nixpkgs
            export PUPPETEER_EXECUTABLE_PATH=${pkgs.chromium.outPath}/bin/chromium

            # If CHROME_BIN isn't set set it to the chromium binary
            export CHROME_BIN=${pkgs.chromium.outPath}/bin/chromium
          '' else ''
            echo "This is a Darwin system, no chromium package available"
            echo "Node.js version:"
            echo "$(${pkgs.nodejs}/bin/node -v)"

            echo "Make sure to set the PUPPETEER_EXECUTABLE_PATH to the path of the chromium binary"
          '';
        };
    });
}
