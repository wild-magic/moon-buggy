import * as React from 'react';
import { connect } from 'react-redux';
import {
  addEntityAction,
  updateEntityAction,
  deleteEntityAction,
  flagUpdatedEntityAction,
  EntityState,
} from 'wild-magix';
import { EntityActions, EntitiesState } from 'wild-magic/lib/Engine/types';
import { isClient } from '../lib/utils';
import Game from '../Game';
import { littleBox, makeBox } from '../Game/entities';

const style = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100vh',
  width: '100vw',
  zIndex: 0,
};

interface GameProps {
  entities: EntitiesState;
  addEntity: EntityActions['addEntity'];
  updateEntity: EntityActions['updateEntity'];
  removeEntity: EntityActions['removeEntity'];
  flagUpdatedEntity: EntityActions['flagUpdatedEntity'];
}

const GameCanvasComponent: React.FunctionComponent<GameProps> = props => {
  const {
    entities,
    addEntity,
    updateEntity,
    removeEntity,
    flagUpdatedEntity,
  } = props;
  const canvasEl = React.useRef<HTMLCanvasElement>(null);
  const [game, setGame] = React.useState<Game | null>(null);

  if (game) {
    try {
      game.setEntities(entities);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    if (isClient && canvasEl && canvasEl.current && !game) {
      try {
        const newGame = new Game(canvasEl.current, {
          addEntity,
          updateEntity,
          removeEntity,
          flagUpdatedEntity,
          getEntities: () => entities,
        });
        setGame(newGame);
        newGame.run();
      } catch (error) {
        console.error(error);
      }
    }
  }, [canvasEl]);

  return (
    <div className="game-container" style={style}>
      <canvas
        id="game"
        ref={canvasEl}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  entities: state.entities,
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  addEntity: (entity: EntityState) => dispatch(addEntityAction(entity)),
  updateEntity: (
    entityUUID: string,
    componentName: string,
    componentData: any
  ) => dispatch(updateEntityAction(entityUUID, componentName, componentData)),
  removeEntity: (entity: EntityState) => dispatch(deleteEntityAction(entity)),
  flagUpdatedEntity: (entityUUID: string) =>
    dispatch(flagUpdatedEntityAction(entityUUID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameCanvasComponent);
