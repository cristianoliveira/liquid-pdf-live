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
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            chromium
          ];

          shellHook = ''
            echo "Node.js version:"
            echo "$(${pkgs.nodejs}/bin/node -v)"

            # Set Puppeteer to not download Chrome, cause it doesn't work on NixOS
            export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
            # Set Puppeteer to use Chromium from Nixpkgs
            export PUPPETEER_EXECUTABLE_PATH=${pkgs.chromium.outPath}/bin/chromium
          '';
        };
    });
}
