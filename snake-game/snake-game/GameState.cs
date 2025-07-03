using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace snake_game
{
    public class GameState
    {
        public int Rows { get; }
        public int Columns { get; }

        public GridValue[,] Grid { get; }

        public Directions Dir { get; private set; }

        public int Score { get; private set; }
        public bool GameOver { get; private set; }

        private readonly LinkedList<Directions> dirChanges = new LinkedList<Directions>();

        private readonly LinkedList<Position> snakePosition = new LinkedList<Position>();
        private readonly Random random = new Random();

        public GameState(int rows, int columns)
        {
            Rows = rows;
            Columns = columns;
            Grid = new GridValue[rows, columns];
            Dir = Directions.Right;

            AddSnake();
            AddFood();
        }

        private void AddSnake()
        {
            int r = Rows / 2;
            for(int c=1; c<=3; c++)
            {
                Grid[r, c] = GridValue.Snake;
                snakePosition.AddFirst(new Position(r, c));
            }
        }

        private IEnumerable<Position> EmptyPositions()
        {
            for (int r = 0; r < Rows; r++)
            {
                for(int c =0; c<Columns; c++)
                {
                    if (Grid[r,c] == GridValue.Empty)
                    {
                        yield return new Position(r, c);
                    }
                }
            }
        }

        private void AddFood()
        {
            List<Position> empty = new List<Position>(EmptyPositions());

            if(empty.Count == 0)
            {
                return;
            }
               
            Position pos = empty[random.Next(empty.Count)];
            Grid[pos.Row, pos.Column] = GridValue.Food;

        }

        public Position HeadPosition()
        {
            return snakePosition.First.Value;
        }

        public Position TailPosition()
        {
            return snakePosition.Last.Value;
        }

        public IEnumerable<Position> SnakePositions()
        {
            return snakePosition;
        }

        public void AddHead(Position pos)
        {
            snakePosition.AddFirst(pos);
            Grid[pos.Row, pos.Column] = GridValue.Snake;
        }

        public void RemoveTail()
        {
            Position tail = snakePosition.Last.Value;
            Grid[tail.Row, tail.Column] = GridValue.Empty;
            snakePosition.RemoveLast();
        }


        private Directions getLastDirection()
        {
            if(dirChanges.Count == 0)
            {
                return Dir;
            }

            return dirChanges.Last.Value;
        }

        private bool canChangeDirection(Directions newDir)
        {
            if (dirChanges.Count == 2)
            {
                return false;
            }
            
            Directions lastDir = getLastDirection();
         
            return (newDir != lastDir && newDir != lastDir.Opposite());
        }   
        public void ChangeDirection(Directions dir)
        {
            if (canChangeDirection(dir))
            {
                dirChanges.AddLast(dir);
            }

        }

        private bool OutsideGrid(Position pos)
        {
            return pos.Row < 0 || pos.Row >= Rows || pos.Column < 0 || pos.Column >= Columns;

        }

        private GridValue WillHit(Position newHeadPos)
        {
            if(OutsideGrid(newHeadPos))
            {
                return GridValue.Outside;
            }

            if(newHeadPos == TailPosition())
            {
                return GridValue.Empty;
            }

            return Grid[newHeadPos.Row, newHeadPos.Column];
        }

        public void Move()
        {

            if(dirChanges.Count > 0)
            {
                Dir = dirChanges.First.Value;
                dirChanges.RemoveFirst();
            }

            Position newHeadPos = HeadPosition().Translate(Dir);
            GridValue hit = WillHit(newHeadPos);
            if (hit == GridValue.Outside || hit == GridValue.Snake)
            {
                GameOver = true;
                return;
            }else if(hit == GridValue.Empty)
            {
                RemoveTail();
                AddHead(newHeadPos);
            }else if (hit == GridValue.Food)
            {
                AddHead(newHeadPos);
                Score++;
                AddFood();
            }
        }
    }
}
