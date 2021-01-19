import React from "react";
import { proxy, useProxy } from "valtio";

import "./App.css";
import pokemon from "./pokemon.json";

import {
  AppLayout,
  Input,
  Cards,
  ColumnLayout,
  Box,
  Button,
  Table,
} from "@awsui/components-react";

interface Pokemon {
  id: number;
  name: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  type: string[];
  base: {
    HP: number;
    Attack: number;
    Defense: number;
    "Sp. Attack": number;
    "Sp. Defense": number;
    Speed: number;
  };
}

interface IStore {
  pokemon: Pokemon[];
  text: string;
  selectedPokemon: Pokemon | null;
}

const store = proxy<IStore>({
  pokemon,
  text: "",
  selectedPokemon: null,
});

interface PokemonImageProps {
  pokemon: Pokemon;
}
const PokemonImage = ({ pokemon }: PokemonImageProps) => (
  <img
    src={`/pokemon/${pokemon.name.english}.jpg`}
    alt={pokemon.name.english}
    style={{
      maxWidth: "100%",
    }}
  />
);

const Content = () => {
  const snapshot = useProxy(store);

  const pokemonSlice = snapshot.pokemon
    .filter((p) => p.name.english.includes(snapshot.text))
    .slice(0, 15);

  return (
    <ColumnLayout>
      <Input
        value={snapshot.text}
        onChange={(evt) => (store.text = evt.detail.value)}
      />
      <Cards
        cardsPerRow={[
          { cards: 3, minWidth: 600 },
          { cards: 5, minWidth: 800 },
        ]}
        items={pokemonSlice}
        cardDefinition={{
          header: (item) => item.name.english,
          sections: [
            {
              content: (item) => (
                <Box fontSize="body-s">{item.name.english}</Box>
              ),
            },
            {
              content: (item) => <PokemonImage pokemon={item} />,
            },
            {
              content: (item) => (
                <Button
                  variant="link"
                  onClick={() => (store.selectedPokemon = item)}
                >
                  <Box fontSize="body-s">More Info...</Box>
                </Button>
              ),
            },
          ],
        }}
      />
    </ColumnLayout>
  );
};

const SelectedPokemon = () => {
  const snapshot = useProxy(store);

  const base: { [key: string]: string | number } =
    snapshot.selectedPokemon?.base || {};
  const baseItems = Object.keys(base).map((key) => ({
    key,
    value: base[key].toString(),
  }));

  return (
    <Box
      margin={{
        left: "m",
        right: "m",
      }}
    >
      <h1>{snapshot.selectedPokemon?.name.english}</h1>
      <PokemonImage pokemon={snapshot.selectedPokemon as Pokemon} />
      <Table
        items={baseItems}
        columnDefinitions={[
          {
            header: "Name",
            cell: (item) => (
              <Box fontSize="body-s" fontWeight="bold">
                {item.key}
              </Box>
            ),
          },
          {
            header: "Value",
            cell: (item) => <Box fontSize="body-s">{item.value}</Box>,
          },
        ]}
      />
    </Box>
  );
};

function App() {
  const snapshot = useProxy(store);

  return (
    <AppLayout
      navigationOpen={false}
      content={<Content />}
      toolsWidth={400}
      toolsOpen={snapshot.selectedPokemon !== null}
      tools={snapshot.selectedPokemon ? <SelectedPokemon /> : null}
    />
  );
}

export default App;
