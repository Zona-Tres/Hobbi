
##No funciona la visualizacion del logo en la wallet
dfx deploy icrc1_ledger_canister --argument '( variant {
    Init = record {
      decimals = opt (8 : nat8);
      token_symbol = "HOB";
      transfer_fee = 1_000 : nat;
      metadata = vec {
        record { 
          "icrc1:logo";
          variant {Text = "data:image/svg+xml;base64,"
          }
        };
        record { "icrc1:decimals"; variant { Nat = 8 : nat } };
        record { "icrc1:name"; variant { Text = "Hobbi" } };
        record { "icrc1:symbol"; variant { Text = "HOB" } };
        record { "icrc1:fee"; variant { Nat = 1_000 : nat } };
        record { "icrc1:max_memo_length"; variant { Nat = 80 : nat } };
      };
      minting_account = record {
        owner = principal "y77j5-4vnxl-ywos7-qjtcr-6iopc-i2ql2-iwoem-ehvwk-wruju-fr7ib-mae";
        subaccount = null;
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "zpdk5-e6ec5-izoeb-uzhwy-rl2ot-4ag42-im6yv-itg3x-inywa-j3bae-tqe";
            subaccount = null;
          };
          1_000_000_000_000_000 : nat;
        };
        record {
          record {
            owner = principal "xigzi-mf2wo-xch5n-4dlsf-5tq6n-pke7b-7w2tx-2fv4h-l3yvi-3ycr2-pae";
            subaccount = null;
          };
          500_000_000_000_000: nat;
        }
      };
      fee_collector_account = opt record {
        owner = principal "epvyw-ddnza-4wy4p-joxft-ciutt-s7pji-cfxm3-khwlb-x2tb7-uo7tc-xae";
        subaccount = null;
      };
      archive_options = record {
        num_blocks_to_archive = 1_000 : nat64;
        max_transactions_per_response = null;
        trigger_threshold = 2_000 : nat64;
        more_controller_ids = opt vec {};
        max_message_size_bytes = null;
        cycles_for_archive_creation = opt (10_000_000_000_000 : nat64);
        node_max_memory_size_bytes = null;
        controller_id = principal "epvyw-ddnza-4wy4p-joxft-ciutt-s7pji-cfxm3-khwlb-x2tb7-uo7tc-xae";
      };
      max_memo_length = null;
      token_name = "Hobbi";
      feature_flags = opt record { icrc2 = true };
    }
  }
)'

dfx deploy icrc1_index_canister --argument '(opt variant {
  Init = record {
    ledger_id = "LedgerCanisterID";
    retrieve_blocks_from_ledger_interval_seconds = null
  }
})'

# dfx deploy icrc1_ledger_canister --ic --argument '(variant {
#     Upgrade = opt record {
#       change_archive_options = null;
#       token_symbol = null;
#       transfer_fee = null;
#       metadata = opt vec {
#         record {
#           "icrc1:logo";
#           variant {
#             Text = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNzYuNDg4NzkybW0iCiAgIGhlaWdodD0iODYuNDU0NjEzbW0iCiAgIHZpZXdCb3g9IjAgMCA3Ni40ODg3OTIgODYuNDU0NjE0IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc1IgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEuMiAoMGEwMGNmNTMzOSwgMjAyMi0wMi0wNCkiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImxvZ28uc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSJmYWxzZSIKICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0ibW0iCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjEuMDI5MjE2MiIKICAgICBpbmtzY2FwZTpjeD0iMTI1LjgyMzkxIgogICAgIGlua3NjYXBlOmN5PSIxNDkuNjI4NDMiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMDM1IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijc3OCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNTAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjExNjkiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiCiAgICAgaW5rc2NhcGU6c25hcC1ncmlkcz0iZmFsc2UiCiAgICAgYm9yZGVybGF5ZXI9ImZhbHNlIgogICAgIHNob3dib3JkZXI9InRydWUiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9ImZhbHNlIgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IkNhcGEgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3Ljk2Nzc5NSwtNDIuOTYxMTQ1KSI+CiAgICA8cGF0aAogICAgICAgc29kaXBvZGk6dHlwZT0ic3RhciIKICAgICAgIHN0eWxlPSJmaWxsOiMwMGZmZmY7ZmlsbC1vcGFjaXR5OjA7c3Ryb2tlOiMzN2Q2ZWE7c3Ryb2tlLXdpZHRoOjE5LjE0MzM7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icGF0aDg4NDQiCiAgICAgICBpbmtzY2FwZTpmbGF0c2lkZWQ9InRydWUiCiAgICAgICBzb2RpcG9kaTpzaWRlcz0iNiIKICAgICAgIHNvZGlwb2RpOmN4PSIxMTQuNTM3MTgiCiAgICAgICBzb2RpcG9kaTpjeT0iMzA1Ljk3OTgzIgogICAgICAgc29kaXBvZGk6cjE9Ijc3Ljc2MzQ5NiIKICAgICAgIHNvZGlwb2RpOnIyPSI2Ny4zNDUxNjEiCiAgICAgICBzb2RpcG9kaTphcmcxPSIwLjUxNjcwNDgyIgogICAgICAgc29kaXBvZGk6YXJnMj0iMS4wNDAzMDM2IgogICAgICAgaW5rc2NhcGU6cm91bmRlZD0iMCIKICAgICAgIGlua3NjYXBlOnJhbmRvbWl6ZWQ9IjAiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjI2NDU4MzMzLDAsMCwwLjI2NDU4MzMzLDE4LjA4NDU3LC01Ljc3ODg2MzYpIgogICAgICAgaW5rc2NhcGU6dHJhbnNmb3JtLWNlbnRlci15PSItMS4wMTk5MzI4ZS0wNiIKICAgICAgIGQ9Im0gMTgyLjE0ODc5LDM0NC4zOTYzOCAtNjcuMDc1NTIsMzkuMzQ1MSAtNjcuNjExNjA4LC0zOC40MTY1NiAtMC41MzYwOTQsLTc3Ljc2MTY1IDY3LjA3NTUxMiwtMzkuMzQ1MDkgNjcuNjExNjEsMzguNDE2NTUgeiIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMzdkNmVhO3N0cm9rZS13aWR0aDo1LjA2NTtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0iTSA2Ni4yNzgxMDMsODUuMzQyNjc2IDg0LjE2NzAwNSw5NS41MDcwNTcgMTAxLjkxNDA3LDg1LjA5NyAxMDEuNzcyMjMsNjQuNTIyNTYzIDgzLjg4MzMyNCw1NC4zNTgxODUiCiAgICAgICBpZD0icGF0aDIxNjE5IiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMzN2Q2ZWE7c3Ryb2tlLXdpZHRoOjUuMDY1O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBkPSJtIDQ4LjUzMTAzOSw5NS43NTI3MzQgMC4xNDE4NCwyMC41NzQ0MzYgYyAwLDAgMTcuODg4OTA1LDEwLjE2NDM4IDE3Ljg4ODkwNSwxMC4xNjQzOCBsIDE3Ljc0NzA2NCwtMTAuNDEwMDYiCiAgICAgICBpZD0icGF0aDIxNzM0IiAvPgogICAgPGVsbGlwc2UKICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiMzN2Q2ZWE7c3Ryb2tlLXdpZHRoOjUuMDY1O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBpZD0icGF0aDI3NDYyIgogICAgICAgY3g9IjkwLjI2NDgwMSIKICAgICAgIGN5PSIxMTIuMzI3MzQiCiAgICAgICByeD0iNS4wNjQyOTUzIgogICAgICAgcnk9IjUuMTU3NjM4MSIgLz4KICAgIDxlbGxpcHNlCiAgICAgICBzdHlsZT0iZmlsbDpub25lO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojMzdkNmVhO3N0cm9rZS13aWR0aDo1LjA2NTtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgaWQ9InBhdGgyNzQ2Mi02IgogICAgICAgY3g9Ijc3Ljc2MzAwOCIKICAgICAgIGN5PSI1MC42NTEyODMiCiAgICAgICByeD0iNS4wNjQyOTUzIgogICAgICAgcnk9IjUuMTU3NjM4MSIgLz4KICA8L2c+Cjwvc3ZnPgo="
#           };
#         };
#       };
#       change_fee_collector = null;
#       max_memo_length = null;
#       token_name = null;
#       feature_flags = null;
#     }
#   }
# )'


# Ejemplo de metadata de ckBTC
#(
#   vec {
#     record {
#       "icrc1:logo";
#       variant {
#         Text = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjE0NiIgdmlld0JveD0iMCAwIDE0NiAxNDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDYiIGhlaWdodD0iMTQ2IiByeD0iNzMiIGZpbGw9IiMzQjAwQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi4zODM3IDc3LjIwNTJDMTguNDM0IDEwNS4yMDYgNDAuNzk0IDEyNy41NjYgNjguNzk0OSAxMjkuNjE2VjEzNS45MzlDMzcuMzA4NyAxMzMuODY3IDEyLjEzMyAxMDguNjkxIDEwLjA2MDUgNzcuMjA1MkgxNi4zODM3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzExMF81NzIpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjguNzY0NiAxNi4zNTM0QzQwLjc2MzggMTguNDAzNiAxOC40MDM3IDQwLjc2MzcgMTYuMzUzNSA2OC43NjQ2TDEwLjAzMDMgNjguNzY0NkMxMi4xMDI3IDM3LjI3ODQgMzcuMjc4NSAxMi4xMDI2IDY4Ljc2NDYgMTAuMDMwMkw2OC43NjQ2IDE2LjM1MzRaIiBmaWxsPSIjMjlBQkUyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTI5LjYxNiA2OC43MzQzQzEyNy41NjYgNDAuNzMzNSAxMDUuMjA2IDE4LjM3MzQgNzcuMjA1MSAxNi4zMjMyTDc3LjIwNTEgMTBDMTA4LjY5MSAxMi4wNzI0IDEzMy44NjcgMzcuMjQ4MiAxMzUuOTM5IDY4LjczNDNMMTI5LjYxNiA2OC43MzQzWiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzExMF81NzIpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNzcuMjM1NCAxMjkuNTg2QzEwNS4yMzYgMTI3LjUzNiAxMjcuNTk2IDEwNS4xNzYgMTI5LjY0NyA3Ny4xNzQ5TDEzNS45NyA3Ny4xNzQ5QzEzMy44OTcgMTA4LjY2MSAxMDguNzIyIDEzMy44MzcgNzcuMjM1NCAxMzUuOTA5TDc3LjIzNTQgMTI5LjU4NloiIGZpbGw9IiMyOUFCRTIiLz4KPHBhdGggZD0iTTk5LjgyMTcgNjQuNzI0NUMxMDEuMDE0IDU2Ljc1MzggOTQuOTQ0NyA1Mi40Njg5IDg2LjY0NTUgNDkuNjEwNEw4OS4zMzc2IDM4LjgxM0w4Mi43NjQ1IDM3LjE3NUw4MC4xNDM1IDQ3LjY4NzlDNzguNDE1NSA0Ny4yNTczIDc2LjY0MDYgNDYuODUxMSA3NC44NzcxIDQ2LjQ0ODdMNzcuNTE2OCAzNS44NjY1TDcwLjk0NzQgMzQuMjI4NUw2OC4yNTM0IDQ1LjAyMjJDNjYuODIzIDQ0LjY5NjUgNjUuNDE4OSA0NC4zNzQ2IDY0LjA1NiA0NC4wMzU3TDY0LjA2MzUgNDQuMDAyTDU0Ljk5ODUgNDEuNzM4OEw1My4yNDk5IDQ4Ljc1ODZDNTMuMjQ5OSA0OC43NTg2IDU4LjEyNjkgNDkuODc2MiA1OC4wMjM5IDQ5Ljk0NTRDNjAuNjg2MSA1MC42MSA2MS4xNjcyIDUyLjM3MTUgNjEuMDg2NyA1My43NjhDNTguNjI3IDYzLjYzNDUgNTYuMTcyMSA3My40Nzg4IDUzLjcxMDQgODMuMzQ2N0M1My4zODQ3IDg0LjE1NTQgNTIuNTU5MSA4NS4zNjg0IDUwLjY5ODIgODQuOTA3OUM1MC43NjM3IDg1LjAwMzQgNDUuOTIwNCA4My43MTU1IDQ1LjkyMDQgODMuNzE1NUw0Mi42NTcyIDkxLjIzODlMNTEuMjExMSA5My4zNzFDNTIuODAyNSA5My43Njk3IDU0LjM2MTkgOTQuMTg3MiA1NS44OTcxIDk0LjU4MDNMNTMuMTc2OSAxMDUuNTAxTDU5Ljc0MjYgMTA3LjEzOUw2Mi40MzY2IDk2LjMzNDNDNjQuMjMwMSA5Ni44MjEgNjUuOTcxMiA5Ny4yNzAzIDY3LjY3NDkgOTcuNjkzNEw2NC45OTAyIDEwOC40NDhMNzEuNTYzNCAxMTAuMDg2TDc0LjI4MzYgOTkuMTg1M0M4NS40OTIyIDEwMS4zMDYgOTMuOTIwNyAxMDAuNDUxIDk3LjQ2ODQgOTAuMzE0MUMxMDAuMzI3IDgyLjE1MjQgOTcuMzI2MSA3Ny40NDQ1IDkxLjQyODggNzQuMzc0NUM5NS43MjM2IDczLjM4NDIgOTguOTU4NiA3MC41NTk0IDk5LjgyMTcgNjQuNzI0NVpNODQuODAzMiA4NS43ODIxQzgyLjc3MiA5My45NDM4IDY5LjAyODQgODkuNTMxNiA2NC41NzI3IDg4LjQyNTNMNjguMTgyMiA3My45NTdDNzIuNjM4IDc1LjA2ODkgODYuOTI2MyA3Ny4yNzA0IDg0LjgwMzIgODUuNzgyMVpNODYuODM2NCA2NC42MDY2Qzg0Ljk4MyA3Mi4wMzA3IDczLjU0NDEgNjguMjU4OCA2OS44MzM1IDY3LjMzNEw3My4xMDYgNTQuMjExN0M3Ni44MTY2IDU1LjEzNjQgODguNzY2NiA1Ni44NjIzIDg2LjgzNjQgNjQuNjA2NloiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTEwXzU3MiIgeDE9IjUzLjQ3MzYiIHkxPSIxMjIuNzkiIHgyPSIxNC4wMzYyIiB5Mj0iODkuNTc4NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNFRDFFNzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTIyNzg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMTBfNTcyIiB4MT0iMTIwLjY1IiB5MT0iNTUuNjAyMSIgeDI9IjgxLjIxMyIgeTI9IjIyLjM5MTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjIxIiBzdG9wLWNvbG9yPSIjRjE1QTI0Ii8+CjxzdG9wIG9mZnNldD0iMC42ODQxIiBzdG9wLWNvbG9yPSIjRkJCMDNCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="
#       };
#     };
#     record { "icrc1:decimals"; variant { Nat = 8 : nat } };
#     record { "icrc1:name"; variant { Text = "ckBTC" } };
#     record { "icrc1:symbol"; variant { Text = "ckBTC" } };
#     record { "icrc1:fee"; variant { Nat = 10 : nat } };
#     record { "icrc1:max_memo_length"; variant { Nat = 80 : nat } };
#   },
# )